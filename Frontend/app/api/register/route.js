import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Registering user with data:", body);

    const {
      role,
      username,
      mobile,
      schoolCode,
      admissionNumber,
      employeeId,
      password,
    } = body;

    await connectMongoDB();

    // Ensure required fields are included
    let userData = {
      role,
      password: await bcrypt.hash(password, 10),
    };

    if (role === "admin") {
      userData.username = username;
      userData.mobile = mobile;
    } else if (role === "student") {
      userData.schoolCode = schoolCode;
      if (admissionNumber) userData.admissionNumber = admissionNumber; // ✅ Only include if it's provided
    } else if (role === "employee") {
      userData.schoolCode = schoolCode;
      if (employeeId) userData.employeeId = employeeId; // ✅ Only include if it's provided
    }

    // Create new user
    const newUser = new User(userData);
    await newUser.save();

    console.log("User registered successfully:", newUser);
    return NextResponse.json(
      { message: "User registered successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in /api/register:", error);
    return NextResponse.json(
      { message: `Error registering user: ${error.message}` },
      { status: 500 }
    );
  }
}
