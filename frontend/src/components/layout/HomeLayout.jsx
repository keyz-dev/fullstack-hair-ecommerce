import React from 'react'
import { Header, Footer } from '../common';
import { Outlet } from 'react-router-dom';

const HomeLayout = () => {
    return (
        <section className="min-h-screen flex flex-col dark:bg-primary">
        <Header />
        <main className="flex-1 pt-28">
            <Outlet />
        </main>
        <Footer />
        </section>
    );
}

export default HomeLayout