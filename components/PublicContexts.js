import { createContext } from "react";

// Used to move between MainStack(Dashboard) and createAgentStack
export const CreateAgentTabContext = createContext('')

// Used to set state when loading or refreshing the Dashboard
export const RefreshingAgentsTabContext = createContext('')