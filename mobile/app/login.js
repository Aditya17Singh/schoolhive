import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Mail, Lock, Phone, Building2 } from "lucide-react-native";

export default function LoginForm() {
  const [role, setRole] = useState("organization");
  const [orgUid, setOrgUid] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (
      (role === "admin" && ((!email && !orgUid) || !password)) ||
      (role === "teacher" && ((!phone && !orgUid) || !password)) ||
      (role === "organization" && (!email || !password))
    ) {
      setError("All fields are required.");
      return;
    }

    setError("");
    setLoading(true);

    let payload = { role, password };

    if (role === "admin") {
      payload = { email: email || orgUid, password, role };
    } else if (role === "teacher") {
      payload = { phoneOrOrgUid: phone || orgUid, password, role };
    } else if (role === "organization") {
      payload = { organizationEmail: email, password, role };
    }

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        navigation.navigate("Dashboard"); // react-navigation
      } else {
        setError(data.message || "Login failed");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-gray-100 px-4">
      <View className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg border border-gray-200">
        <Text className="text-center text-2xl font-bold text-gray-800">Sign In</Text>

        {error ? (
          <Text className="mt-2 text-center text-red-500">{error}</Text>
        ) : null}

        {/* Role Selection */}
        <Text className="mt-4 mb-1 text-sm font-medium text-gray-700">Role</Text>
        <View className="border border-gray-300 rounded-md bg-gray-50">
          <Picker
            selectedValue={role}
            onValueChange={(value) => {
              setRole(value);
              setEmail("");
              setPhone("");
              setOrgUid("");
              setPassword("");
            }}
          >
            <Picker.Item label="Organization" value="organization" />
            <Picker.Item label="Teacher" value="teacher" />
            <Picker.Item label="Admin" value="admin" />
          </Picker>
        </View>

        {/* Admin: Email or UID */}
        {role === "admin" && (
          <View className="mt-4">
            <Text className="mb-1 text-sm font-medium text-gray-700">
              Email or Organization UID
            </Text>
            <View className="flex-row items-center border border-gray-300 rounded-md px-2">
              <Mail size={18} color="gray" />
              <TextInput
                className="flex-1 px-2 py-2 text-sm"
                placeholder="Enter email or org UID"
                value={email || orgUid}
                onChangeText={(text) => {
                  setEmail(text);
                  setOrgUid(text);
                }}
              />
            </View>
          </View>
        )}

        {/* Teacher: Phone or UID */}
        {role === "teacher" && (
          <View className="mt-4">
            <Text className="mb-1 text-sm font-medium text-gray-700">
              Phone or Organization UID
            </Text>
            <View className="flex-row items-center border border-gray-300 rounded-md px-2">
              <Phone size={18} color="gray" />
              <TextInput
                className="flex-1 px-2 py-2 text-sm"
                placeholder="Enter phone or org UID"
                value={phone || orgUid}
                onChangeText={(text) => {
                  setPhone(text);
                  setOrgUid(text);
                }}
              />
            </View>
          </View>
        )}

        {/* Organization: Email */}
        {role === "organization" && (
          <View className="mt-4">
            <Text className="mb-1 text-sm font-medium text-gray-700">
              Organization Email
            </Text>
            <View className="flex-row items-center border border-gray-300 rounded-md px-2">
              <Building2 size={18} color="gray" />
              <TextInput
                className="flex-1 px-2 py-2 text-sm"
                placeholder="example@org.com"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>
        )}

        {/* Password */}
        <View className="mt-4">
          <Text className="mb-1 text-sm font-medium text-gray-700">Password</Text>
          <View className="flex-row items-center border border-gray-300 rounded-md px-2">
            <Lock size={18} color="gray" />
            <TextInput
              className="flex-1 px-2 py-2 text-sm"
              placeholder="Enter password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
        </View>

        {/* Submit Button */}
        <Pressable
          onPress={handleSubmit}
          disabled={loading}
          className={`mt-6 w-full rounded-md py-2 flex items-center justify-center ${
            loading ? "bg-blue-400" : "bg-blue-600"
          }`}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold">Sign In</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
