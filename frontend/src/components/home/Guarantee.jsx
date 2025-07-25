import { guaranteeItems } from "../../constants/data";
import { GuaranteeCard } from "../ui";

const Guarantee = () => {
    return (
      <>
        <section id="guarantee" className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-16">
          {guaranteeItems.map((item, index) => (
            <GuaranteeCard
              key={index}
              item={item}
            />
          ))}
        </section>
        <section className="h-[40px] w-full"></section>
      </>
    );
  };
  
  export default Guarantee;
  