import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Archive {
  'add_tx' : ActorMethod<[TxId], addTxReceipt>,
  'set_next_archive' : ActorMethod<[[] | [Principal]], undefined>,
}
export interface ArchiveCanister {
  'add_tx' : ActorMethod<[TxId], addTxReceipt>,
  'set_next_archive' : ActorMethod<[[] | [Principal]], undefined>,
}
export interface Regulator {
  'add_tx' : ActorMethod<[TxId__2], [addTxReceipt, [] | [Principal]]>,
  'generate_archive_canister' : ActorMethod<[], Principal>,
  'get_or_set_archive_canister' : ActorMethod<[], Principal>,
  'set_next_archive' : ActorMethod<[Principal], [] | [Principal]>,
}
export type TxId = string;
export type TxId__1 = string;
export type TxId__2 = string;
export type addTxReceipt = { 'TxExists' : [Principal, TxId__1] } |
  { 'TxAdded' : [Principal, TxId__1] } |
  { 'ArchiveFull' : [Principal, TxId__1] };
export interface _SERVICE extends Regulator {}
