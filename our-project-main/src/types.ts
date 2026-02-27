export interface User {
  id: number;
  username: string;
  email: string;
  personal_email?: string;
  department: string;
  skills?: string;
  projects?: string;
}

export interface Offer {
  id: number;
  user_id: number;
  username: string;
  skill_name: string;
  category: string;
  credits: number;
  description: string;
}

export interface Discussion {
  id: number;
  content: string;
  timestamp: string;
}

export interface HelpRequest {
  id: number;
  user_id: number;
  username: string;
  title: string;
  type: string;
  description: string;
}

export const ENGINEERING_SKILLS = [
  "Web Development",
  "App Development",
  "Data Science",
  "Machine Learning",
  "UI/UX Design",
  "Cloud Computing",
  "Cyber Security",
  "Embedded Systems",
  "Robotics",
  "VLSI Design",
  "AutoCAD/SolidWorks",
  "Power Systems",
  "Structural Engineering",
  "Chemical Process Design"
];

export const DEPARTMENTS = [
  "Computer Science",
  "Electronics & Communication",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
  "Information Technology",
  "Chemical Engineering"
];
