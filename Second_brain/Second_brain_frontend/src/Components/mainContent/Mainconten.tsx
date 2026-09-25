import Cardgird from "./Cardgird"
import  Mainnav  from "./Mainnav"

export const Mainconten = () => {
  return (
    <div className="h-full bg-gray-100 p-5">
        <div className="h-[20%]">
<Mainnav/>
        </div>

        <div  className="flex-1 bg-pink-300">
<Cardgird/>
        </div>
    </div>
  )
}
