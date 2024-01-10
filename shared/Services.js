import AsyncStorage from "@react-native-async-storage/async-storage";

const setUserAuth = async (value) => {
  await AsyncStorage.setItem("userData", JSON.stringify(value));
};

const getUserAuth = async () => {
  const value = await AsyncStorage.getItem("userData");
  return JSON.parse(value);
};

const Logout = () => {
  AsyncStorage.clear();
};

const setPushToken = async (pushToken) => {
  await AsyncStorage.setItem("pushToken", pushToken);
}

const getPushToken = async () => {
  const value = await AsyncStorage.getItem("pushToken");
  return value;
};

export default { setUserAuth, getUserAuth, Logout, setPushToken, getPushToken };
