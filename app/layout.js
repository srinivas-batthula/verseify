import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Layout from '@/components/Layout'
import { Toaster } from "sonner";


export const viewport = {
    themeColor: "rgba(177, 68, 255, 0.853)",
}

export const metadata = {
    title: 'NextJs Test',
    description: 'A Next.js test project',
    authors: [{ name: 'Srinivas Batthula' }],
    // Add more global metadata if needed
    // For example, Open Graph, Twitter Cards, etc.
}


export default function RootLayout({ children }) {

    return (
        <html lang="en">
            <head>
                {/* <link rel="manifest" href="http://localhost:3000/manifest.json" /> */}
                <meta name="theme-color" content="rgba(177, 68, 255, 0.853)" />
                {/* Custom meta tags */}
                <meta name="author" content="Srinivas Batthula" />
                {/* External stylesheets */}
                <link
                    href="https://cdn.jsdelivr.net/npm/tailwindcss@2.1.2/dist/tailwind.min.css"
                    rel="stylesheet"
                />
                <link
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
                    rel="stylesheet"
                />
                <link
                    rel="stylesheet"
                    type="text/css"
                    href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
                />
                {/* Other head tags as necessary */}
                <script type="text/javascript" src="https://platform-api.sharethis.com/js/sharethis.js#property=67926e29c7696f001258a0c7&product=inline-share-buttons&source=platform" async="async"></script>
            </head>

            <body >
                {/* Main content of your application */}
                <Layout>
                    {children}
                    
                    <Toaster />
                </Layout>
            </body>
        </html>
    );
}
