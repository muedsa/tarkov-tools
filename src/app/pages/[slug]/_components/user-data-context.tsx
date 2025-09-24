"use client";

import { createContext, useContext, useReducer, useEffect } from "react";

const USER_DATA_LOCAL_STORAGE_KEY = "USER_DATA";

// 定义初始状态
const initialState: UserData = {
  loading: true,
  completedHideoutStations: {},
  completedTasks: [],
  collectedItems: {},
};

type UserDataAction =
  | {
      type: "CHANGE_HIDEOUT_STATION_LEVEL" | "CHNAGE_COLLECTED_ITEM";
      id: string;
      count: number;
    }
  | {
      type: "ADD_COMPLETEED_TASK" | "REMOVE_COMPLETEED_TASK";
      id: string;
    }
  | {
      type: "LOAD_STATE";
      state: UserData;
    };

interface UserDataContextValue {
  userData: UserData;
  changeHideoutStationLevel: (id: string, count: number) => void;
  addCompletedTask: (id: string) => void;
  removeCompletedTask: (id: string) => void;
  changeCollectedItem: (id: string, count: number) => void;
}

// 创建Context
const UserDataContext = createContext<UserDataContextValue | undefined>(
  undefined
);

// 定义reducer函数
function userDataReducer(state: UserData, action: UserDataAction) {
  if (action.type === "CHANGE_HIDEOUT_STATION_LEVEL") {
    state.completedHideoutStations[action.id] = action.count;
    localStorage.setItem(USER_DATA_LOCAL_STORAGE_KEY, JSON.stringify(state));
    return {
      ...state,
      completedHideoutStations: { ...state.completedHideoutStations },
    };
  } else if (action.type === "ADD_COMPLETEED_TASK") {
    const index = state.completedTasks.indexOf(action.id);
    if (index > -1) {
      return { ...state };
    } else {
      state.completedTasks.push(action.id);
      localStorage.setItem(USER_DATA_LOCAL_STORAGE_KEY, JSON.stringify(state));
      return {
        ...state,
        completedTasks: [...state.completedTasks],
      };
    }
  } else if (action.type === "REMOVE_COMPLETEED_TASK") {
    const index = state.completedTasks.indexOf(action.id);
    if (index > -1) {
      state.completedTasks.splice(index);
      localStorage.setItem(USER_DATA_LOCAL_STORAGE_KEY, JSON.stringify(state));
      return {
        ...state,
        completedTasks: [...state.completedTasks],
      };
    } else {
      return { ...state };
    }
  } else if (action.type === "CHNAGE_COLLECTED_ITEM") {
    state.collectedItems[action.id] = action.count;
    localStorage.setItem(USER_DATA_LOCAL_STORAGE_KEY, JSON.stringify(state));
    return {
      ...state,
      collectedItems: { ...state.collectedItems },
    };
  } else if (action.type === "LOAD_STATE") {
    action.state.loading = false;
    if (Object.is(state, action.state)) {
      return { ...action.state };
    } else {
      return action.state;
    }
  } else {
    throw Error("未知 action: " + action.type);
  }
}

export function UserDataProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(userDataReducer, initialState);

  // 从localStorage加载数据
  useEffect(() => {
    try {
      const userDataStr = localStorage.getItem(USER_DATA_LOCAL_STORAGE_KEY);
      if (userDataStr) {
        const userData: UserData = JSON.parse(userDataStr);
        if (!userData.collectedItems) {
          userData.collectedItems = {};
        }
        if (!userData.completedTasks) {
          userData.completedTasks = [];
        }
        if (!userData.completedHideoutStations) {
          userData.completedHideoutStations = {};
        }
        dispatch({ type: "LOAD_STATE", state: userData });
      } else {
        dispatch({ type: "LOAD_STATE", state: initialState });
      }
    } catch (error) {
      console.error("Failed to load todos from localStorage:", error);
    }
  }, []);

  // 保存到localStorage
  // useEffect(() => {
  //   try {
  //     localStorage.setItem(USER_DATA_LOCAL_STORAGE_KEY, JSON.stringify(state));
  //   } catch (error) {
  //     console.error("Failed to save todos to localStorage:", error);
  //   }
  // }, [state]);

  // 操作
  const changeHideoutStationLevel = (id: string, count: number) => {
    dispatch({ type: "CHANGE_HIDEOUT_STATION_LEVEL", id: id, count: count });
  };

  const addCompletedTask = (id: string) => {
    dispatch({ type: "ADD_COMPLETEED_TASK", id: id });
  };

  const removeCompletedTask = (id: string) => {
    dispatch({ type: "REMOVE_COMPLETEED_TASK", id: id });
  };

  const changeCollectedItem = (id: string, count: number) => {
    dispatch({ type: "CHNAGE_COLLECTED_ITEM", id: id, count: count });
  };

  // 提供给上下文的值
  const value: UserDataContextValue = {
    userData: state,
    changeHideoutStationLevel,
    addCompletedTask,
    removeCompletedTask,
    changeCollectedItem,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}

// 自定义Hook
export function useUserDataContext() {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error("useUserData must be used within a UserDataProvider");
  }
  return context;
}
