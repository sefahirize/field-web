import { Header, Footer } from "@landing/components/Layout";

const SecondaryLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Header isDark={true} />
            <main>
                {children}
            </main>
            <Footer />
        </>
    )
}

export default SecondaryLayout;