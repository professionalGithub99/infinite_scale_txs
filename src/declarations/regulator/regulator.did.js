export const idlFactory = ({ IDL }) => {
  const Archive = IDL.Rec();
  const TxId__2 = IDL.Text;
  const TxId__1 = IDL.Text;
  const addTxReceipt = IDL.Variant({
    'TxExists' : IDL.Tuple(IDL.Principal, TxId__1),
    'TxAdded' : IDL.Tuple(IDL.Principal, TxId__1),
    'ArchiveFull' : IDL.Tuple(IDL.Principal, TxId__1),
  });
  const TxId = IDL.Text;
  Archive.fill(
    IDL.Service({
      'add_tx' : IDL.Func([TxId], [addTxReceipt], []),
      'set_next_archive' : IDL.Func([IDL.Opt(Archive)], [], []),
    })
  );
  const ArchiveCanister = IDL.Service({
    'add_tx' : IDL.Func([TxId], [addTxReceipt], []),
    'set_next_archive' : IDL.Func([IDL.Opt(Archive)], [], []),
  });
  const Regulator = IDL.Service({
    'add_tx' : IDL.Func([TxId__2], [addTxReceipt, IDL.Opt(IDL.Principal)], []),
    'generate_archive_canister' : IDL.Func([], [ArchiveCanister], []),
    'get_or_set_archive_canister' : IDL.Func([], [ArchiveCanister], []),
    'set_next_archive' : IDL.Func(
        [IDL.Principal],
        [IDL.Opt(IDL.Principal)],
        [],
      ),
  });
  return Regulator;
};
export const init = ({ IDL }) => { return [IDL.Principal]; };
