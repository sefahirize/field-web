import { Header, Footer } from "@landing/components/Layout";

const PrimaryLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Header />
            <main>
                {children}
            </main>
            <Footer />
        </>
    )
}

export default PrimaryLayout;