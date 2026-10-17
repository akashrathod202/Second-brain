import HomeHeader from "../../Components/Home/HomeHeader";
import HomeHero from "./HomeHero";
import HomeStats from "./HomeStats";
import Footer from "./Footer"
import RecentItems from "./RecentItems";
import QuickActions from "./QuickActions";

const Home = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-7">

        <HomeHeader />

        <HomeHero />

 

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          <RecentItems />
          <QuickActions />
              

        </div>
        <Footer/>
      </div>
    </div>
  );
};

export default Home;