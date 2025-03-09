'use client';

import styled from 'styled-components';
import useThemeStore from '@/stores/useThemeStore';


const ContactWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    width: 100%;
    min-height: 100vh;
    padding: 2rem;
`;

const ContactContent = styled.div`
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 65%;  /* Desktop: Centered */

    @media (max-width: 768px) {
    max-width: 100%;  /* Mobile: Full Width */
    }
`;

const Title = styled.h1`
    font-size: 2rem;
    font-weight: bold;
`;

const ContactItem = styled.div`
    font-size: 1.1rem;
    margin: 1rem 0;

    a {
    color: #007aff;
    text-decoration: none;
    font-weight: bold;
    }
    a:hover {
    text-decoration: underline;
    }
`;


export default function Contact() {
    const {theme} = useThemeStore()

    return (
        <ContactWrapper>
            <ContactContent style={{color: theme, background:(theme==='white')?'black':'white'}}>
                <Title style={{marginBottom:'5rem'}}>📬 Contact Verseify</Title>
                <ContactItem style={{marginBottom:'3rem'}}>We’d love to hear from you!</ContactItem>
                <ContactItem>Email: <a href="mailto:srinivasbatthula.mypc@gmail.com">support@verseify.com</a></ContactItem>
                <ContactItem>LinkedIn: <a href="https://www.linkedin.com/in/srinivas-batthula/" target="_blank">@verseify</a></ContactItem>
                <ContactItem>Connect with me: <a href="https://portfolio-phi-three-63.vercel.app/" target="_blank">@Founder/Verseify</a></ContactItem>
                <ContactItem>To report a bug, please create a <a href="https://github.com/srinivas-batthula/verseify/issues" target="_blank">GitHub Issue</a>.</ContactItem>
                <ContactItem>To request a feature, please start a <a href="https://github.com/your-repo/discussions" target="_blank">GitHub Discussion</a>!</ContactItem>
            </ContactContent>
        </ContactWrapper>
    )
}
