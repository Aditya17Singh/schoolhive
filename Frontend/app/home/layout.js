import Header from "@/components/Header";

export default function HomeLayout({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
