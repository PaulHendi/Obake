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
                    <p>One day, a young man named Pilu was walking through the forest when he heard a loud trumpet. He looked around but saw nothing. Suddenly, a giant elephant appeared before him. It was Obake, the ghostly elephant.</p>
                    <p>"Who are you?" Pilu asked, amazed.</p>
                    <p>"I am Obake, the elephant ghost," the creature replied. "I have come to offer you a proposition."</p>
                    <p>Pilu was skeptical, but Obake explained that it was part of a magical NFT collection that granted stable passive income to its holders. The collection was comprised of unique and beautiful digital art pieces inspired by the legends and stories of Ancient Japan. Obake urged Pilu to invest in the collection, and he would be rewarded with a lifetime of stable passive income.</p>
                    <p>Pilu was intrigued by the idea, but he wasn't sure if he could trust a ghostly elephant. Obake understood his doubts and offered Pilu a chance to prove his worthiness. He challenged Pilu to solve a riddle:</p>
                    <blockquote>
                    <p>"I am the beginning of eternity, the end of time and space. I am the beginning of the end, and the end of every place. What am I?"</p>
                    </blockquote>
                </StoryTextContainer>
                <ImgContainer src={ObakeLogo} alt="Obake" />
            </StoryContainer>
            <EndStoryContainer>
                <p>Pilu thought hard, but he couldn't solve the riddle. Obake revealed the answer: "The letter 'E'". Pilu was impressed, and he realized that Obake was not just an ordinary ghostly elephant.</p>
                <p>Feeling convinced, Pilu decided to invest in the NFT collection. As soon as he did, he felt a powerful energy flowing through his body. He could see the magic in the digital art pieces, and he knew that Obake had granted him the power to protect his investment.</p>
                <p>From that day forward, Pilu became an advocate for the NFT collection. He traveled throughout the land, spreading the word of Obake's NFT collection and the stable passive income it could bring to those who invested.</p>
                <p>Obake, the elephant ghost, may have been a mythical creature, but its power and influence were felt throughout Ancient Japan. The NFT collection that Obake represented became a symbol of wealth and prosperity for those who invested, and it continued to inspire and enrich the lives of many for generations to come.</p>
            </EndStoryContainer>

            <h1>Disclaimer</h1>
            <p>This is not a financial advice. Do your own research and seek independent advice when required. Investing carries risks.</p>
        </HomeContainer>
    );
}