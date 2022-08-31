export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'addAdmin' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'addClient' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'getAdminList' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'getAllLocks' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'getClientList' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'getLockState' : IDL.Func([IDL.Text], [IDL.Bool], ['query']),
    'lock' : IDL.Func(
        [IDL.Text],
        [IDL.Record({ 'time' : IDL.Int, 'state' : IDL.Bool })],
        [],
      ),
    'removeAdmin' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'removeClient' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'unlock' : IDL.Func([IDL.Text], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
