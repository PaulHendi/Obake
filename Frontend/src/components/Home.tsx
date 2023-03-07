import React from "react";
import { HomeContainer, ImgContainer, StoryContainer, StoryTextContainer, EndStoryContainer } from "../styles/Home.style";
import ObakeLogo from "../assets/ObakeLogo.jpg";

export default function Home() {
    return (
        <HomeContainer>

            <h1>Obake NFT Project</h1>
            <p>Obake is an NFT premium pass that grants revenues to its holder. The revenues are generated from games such as a coin flip and a raffle, which are part of the Obake ecosystem. Holders can stake their Obake NFT and claim rewards whenever they want.</p>
            <p>What makes Obake unique is that every smart contract works automatically in a decentralized way, without any human intervention. This ensures a smooth experience as well as stable and long-term revenues for the holders.</p>

            <h1>The story</h1>
            <StoryContainer>
                <StoryTextContainer>
                    <p>In ancient Japan, there was a ghostly elephant named Obake. It was said that Obake was once a real elephant that had lived for centuries and had gained magical powers. After its death, it became a ghost that roamed the land, seeking to help those in need.</p>
                    <p>One day, Obake came to offer a proposition to a man named Pilu. The elephant said that it was part of a magical NFT collection that granted stable passive income to its holders.</p>
                    <p>Pilu was intrigued by the idea, but he wasn't sure if he could trust a ghostly elephant. Obake understood his doubts and offered Pilu a chance to prove his worthiness. He challenged Pilu to solve a riddle:</p>
                    <blockquote>
                    <p>"I am the beginning of eternity, the end of time and space. I am the beginning of the end, and the end of every place. What am I?"</p>
                    </blockquote>
                    <p>Pilu thought hard, but he couldn't solve the riddle. Obake revealed the answer: "The letter 'E'". Pilu was impressed, and he realized that Obake was not just an ordinary ghostly elephant.</p>
                    <p>From that day forward, Pilu became an advocate for the NFT collection. He traveled throughout the land, spreading the word of Obake's NFT collection and the stable passive income it could bring to those who invested.</p>                    
                </StoryTextContainer>
                <ImgContainer src={ObakeLogo} alt="Obake" />
            </StoryContainer>
      
        </HomeContainer>
    );
}