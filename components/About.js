'use client'

import styled from "styled-components";


const Container = styled.div`
    @apply mx-auto flex flex-col items-center text-center px-4 py-8;
    width: 100%;

  @media (min-width: 800px) { /* Desktop */
    width: 65%;
    }
`;

const Heading = styled.h1`
    @apply text-3xl lg:text-4xl font-bold text-gray-800 mb-6;
`;

const Paragraph = styled.p`
    @apply text-lg text-gray-600 leading-relaxed mb-4;
`;

const Highlight = styled.span`
    @apply text-blue-600 font-semibold;
`;

const FooterText = styled.div`
    @apply text-gray-700 mt-6 text-sm;
`;


export default function About() {
    return (
        <div style={{height:'100vh', textAlign:'center', display:'flex', justifyContent:'center', justifyItems:'center', alignContent:'center', alignItems:'center'}}>
            <Container>
                <Heading style={{fontSize:'1.8rem', fontWeight:'bold', marginBottom:'1.5rem', marginTop:'1rem'}}>About <Highlight>Verseify</Highlight></Heading>

                <Paragraph style={{marginTop:'0.8rem', fontSize:'1.1rem'}}>
                    Verseify is a vibrant community where bloggers, writers, and storytellers come together to
                    share ideas, spark discussions, and inspire the world with words. We believe that every blog
                    is a unique verse in the ever-growing story of the internet.
                </Paragraph>

                <Paragraph style={{marginTop:'0.8rem', fontSize:'1.1rem'}}>
                    Built with passion, Verseify provides a space for creative minds to connect, learn, and grow.
                    Whether you're here to express your thoughts, explore new perspectives, or engage in meaningful
                    conversations, this platform is designed to empower your voice.
                </Paragraph>

                <Paragraph style={{marginTop:'0.8rem', fontSize:'1.1rem'}}>
                    Verseify is crafted with modern web technologies, ensuring a seamless and enriching experience.
                    Our commitment to openness and collaboration drives us to continuously improve and create a
                    space where every writer feels valued.
                </Paragraph>

                <FooterText style={{fontSize:'1.1rem'}} className="mt-28">
                    Verseify is led by{" "}
                    <a href="https://portfolio-phi-three-63.vercel.app/" target="_blank" className="text-blue-500 font-medium hover:underline">
                        Srinivas Batthula
                    </a>
                </FooterText>

                <FooterText style={{fontSize:'1.1rem'}} className="mt-4">
                    <strong>Your words matter. Your stories inspire.</strong> Welcome to Verseify!
                </FooterText>
            </Container>
        </div>
    );
}
