import type { Principal } from '@dfinity/principal';
export interface _SERVICE {
  'addAdmin' : (arg_0: string) => Promise<boolean>,
  'addClient' : (arg_0: string) => Promise<boolean>,
  'getAdminList' : () => Promise<Array<string>>,
  'getAllLocks' : () => Promise<Array<string>>,
  'getClientList' : () => Promise<Array<string>>,
  'getLockState' : (arg_0: string) => Promise<boolean>,
  'lock' : (arg_0: string) => Promise<{ 'time' : bigint, 'state' : boolean }>,
  'removeAdmin' : (arg_0: string) => Promise<boolean>,
  'removeClient' : (arg_0: string) => Promise<boolean>,
  'unlock' : (arg_0: string) => Promise<undefined>,
}
