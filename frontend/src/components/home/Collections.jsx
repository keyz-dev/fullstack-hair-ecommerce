import React from 'react';
import { Button } from '../ui';
import colBg1 from '../../assets/images/cat1.png';
import colBg2 from '../../assets/images/cat2.jpg';

const Collections = () => {
    return (
        <section id="categories" className="container grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-10 my-8">
            <div
                className="relative min-h-[220px] sm:h-[40vh] bg-no-repeat bg-cover bg-center text-white overflow-hidden"
                style={{ backgroundImage: `url(${colBg1})` }}
            >
                {/* Dark overlay for better text visibility */}
                <div className="absolute inset-0 bg-black/10" />
                <div className="relative h-full w-full flex flex-col items-end justify-center gap-2 p-5">
                    <p className="text-border_clr text-xs sm:text-sm">Post-Christmas Delivery</p>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal mb-2 text-right">
                        New <br />Collection
                    </h2>
                    <Button
                        text="SHOP NOW"
                        additionalClasses="secondarybtn text-xs border-none min-w-fit min-h-fit px-3 py-2"
                    />
                </div>
            </div>

            <div
                className="relative min-h-[220px] sm:h-[40vh] bg-no-repeat bg-cover bg-top overflow-hidden"
                style={{ backgroundImage: `url(${colBg2})` }}
            >
                {/* Dark overlay for better text visibility */}
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative h-full w-full flex flex-col items-start justify-center gap-2 p-5">
                    <p className="text-border_clr text-xs sm:text-sm">Dispatched within a week</p>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal mb-2 max-w-[200px] sm:w-1/2">
                        <span className="block">Elegant</span>
                        <span className="block">Hygiene Kit</span>
                    </h2>
                    <Button
                        text="SEE MORE"
                        additionalClasses="secondarybtn text-xs border-none min-w-fit min-h-fit px-3 py-2"
                    />
                </div>
            </div>
        </section>
    );
};


export default Collections;
