use candid::{CandidType, Decode, Encode, Principal};
use serde::{Deserialize, Serialize};
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{BoundedStorable, DefaultMemoryImpl, StableBTreeMap, Storable};
use std::{borrow::Cow, cell::RefCell};
use ic_cdk::api::caller;

type Memory = VirtualMemory<DefaultMemoryImpl>;
const MAX_VALUE_SIZE: u32 = 5000;

#[derive(CandidType, Deserialize)]
enum AuctionError {
    ItemNotFound,
    NotOwner,
    InactiveItem,
    AlreadyStopped,
    BidTooLow,
    UpdateError,
}

#[derive(Clone, CandidType, Deserialize, Serialize)]
pub struct Item {
    pub name: String,
    pub description: String,
    pub starting_price: f64,
    pub highest_bid: f64,
    pub highest_bidder: Option<Principal>,
    pub owner: Principal,
    pub is_active: bool,
    pub new_owner: Option<Principal>,
}

#[derive(CandidType, Deserialize,)]
struct CreateItem {
    name: String,
    description: String,
    starting_price: f64,
    is_active: bool,
}


impl Storable for Item {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }
    fn from_bytes(bytes: Cow<[u8]>) -> Self{
        Decode!(bytes.as_ref(), Self).unwrap()
    }
}

impl BoundedStorable for Item{
    const MAX_SIZE: u32 = MAX_VALUE_SIZE;
    const IS_FIXED_SIZE: bool = false;
} 

thread_local!{
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> = RefCell::new(
        MemoryManager::init(
            DefaultMemoryImpl::default()
        )
    );

    static ITEM_MAP: RefCell<StableBTreeMap<u64, Item, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(0)))
        )
    );
}

#[ic_cdk::update]
fn create_item(key: u64, item: CreateItem) -> Option<Item> {
    let item = Item {
        name: item.name,
        description: item.description,
        starting_price: item.starting_price,
        owner: caller(),
        is_active: item.is_active,
        new_owner: None,
        highest_bid: 0.0,
        highest_bidder: None,
    };

    ITEM_MAP.with(|i| {
        i.borrow_mut().insert(key, item)
    })
}

#[ic_cdk::update]
fn bid_item(key: u64, amount: f64) -> Result<(), AuctionError> {
    ITEM_MAP.with(|map| {
        let mut item = match map.borrow().get(&key) {
            Some(item) => item.clone(),
            None => return Err(AuctionError::ItemNotFound),
        };

        if !item.is_active {
            return Err(AuctionError::InactiveItem);
        }

        if amount <= item.highest_bid || amount <=item.starting_price{
            return Err(AuctionError::BidTooLow);
        }

        item.highest_bid = amount;
        item.highest_bidder = Some(caller());

        let res = map.borrow_mut().insert(key, item);
        match res {
            Some(_) => Ok(()),
            None => Err(AuctionError::UpdateError),
        }
    })
}

#[ic_cdk::update]
fn end_item(key: u64) -> Result<(), AuctionError> {
    ITEM_MAP.with(|map| {
        let mut item = match map.borrow().get(&key) {
            Some(i) => i.clone(),
            None => return Err(AuctionError::ItemNotFound),
        };

        if caller() != item.owner {
            return Err(AuctionError::NotOwner);
        }

        if !item.is_active {
            return Err(AuctionError::AlreadyStopped);
        }

        item.is_active = false;
        item.new_owner = item.highest_bidder;

        let result = map.borrow_mut().insert(key, item);
        match result {
            Some(_) => Ok(()),
            None => Err(AuctionError::UpdateError),
        }
    })
}

#[ic_cdk::query]
fn get_item(key: u64) -> Option<Item> {
    ITEM_MAP.with(|map| map.borrow().get(&key))
}

#[ic_cdk::query]
fn list_items() -> Vec<Item> {
    ITEM_MAP.with(|map| {
        map.borrow().iter().map(|(_, item)| item.clone()).collect()
    })
}

ic_cdk::export_candid!();