import Header from "./components/Header";
import Settings from "./components/Settings";

export default function App() {
  return <section className="w-screen h-screen flex flex-col bg-primary relative rounded-2xl border-r-2 drag-region">
    <Header />

    <div className="h- flex flex-col items-center mt-1 rounded-2xl">
      <h1 className="text-5xl text-center text-secondery">Water Reminder</h1>

      <Settings />
    </div>
  </section>
}