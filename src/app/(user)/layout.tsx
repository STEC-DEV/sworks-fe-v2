
import NormalLayout from "@/components/layout/normal-layout";


export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <NormalLayout children={children} />
        </>
    );
}
