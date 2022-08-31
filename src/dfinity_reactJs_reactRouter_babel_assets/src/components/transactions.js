export const idlFactory = ({ IDL }) => {
  const Tx = IDL.Record({
    'principle' : IDL.Text,
    'action' : IDL.Text,
    'asset' : IDL.Text,
    'interest' : IDL.Text,
    'date' : IDL.Text,
    'fees' : IDL.Text,
    'timestamp' : IDL.Text,
    'price' : IDL.Text,
    'amount' : IDL.Text,
  });
  return IDL.Service({
    'addTx' : IDL.Func(
        [
          IDL.Principal,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
        ],
        [],
        [],
      ),
    'getTx' : IDL.Func([IDL.Principal], [IDL.Opt(IDL.Vec(Tx))], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
