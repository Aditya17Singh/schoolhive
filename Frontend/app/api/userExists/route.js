import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Checking user existence with data:", body);

    const { mobile, schoolCode, admissionNumber, employeeId } = body;
    await connectMongoDB();

    const existingUser = await User.findOne({
      $or: [
        { mobile }
      ]
    });
    console.log(existingUser, 'existingUser');
    
    if (existingUser) {
      console.log("User already exists:", existingUser);
      return NextResponse.json({ message: "User already exists." }, { status: 400 });
    }

    return NextResponse.json({ message: "User does not exist." }, { status: 200 });
  } catch (error) {
    console.error("Error in /api/userExists:", error);
    return NextResponse.json({ message: "Error checking user existence." }, { status: 500 });
  }
}
