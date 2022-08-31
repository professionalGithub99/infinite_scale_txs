const Agent = require("@dfinity/agent");

import fetch from "isomorphic-fetch";

export const createActor = async(canisterId,options,idlFactory) => {
	const agent = new Agent.HttpAgent({...options?.agentOptions});
	await agent.fetchRootKey();
    return Agent.Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options?.actorOptions,
  });
};
