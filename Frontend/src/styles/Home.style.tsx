import styled from "styled-components";

export const HomeContainer = styled.div`
    display: flex;
    flex-direction: column;
    //align-items: center;
    //justify-content: center;
    margin-top: 1%;
    margin-bottom: 1%;
    margin-left: 1%;
    margin-right: 1%;
    background-color: #FFFFFF;
    border-radius: 10px;
    padding: 5px;
    //color: #FFFFFF;
    font-family: Arial, Helvetica, sans-serif;
    font-size: large;
    text-align: left;
   // box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);

    h1 {
    font-size: 24px;
    margin-top: 0;
    //color :#9381FF;
    }

    p {
        font-size: 16px;
        line-height: 1.5;
        margin-bottom: 20px;
    }
    `

export const StoryContainer = styled.div`
    display: flex;
    flex-direction: row;
    `

export const StoryTextContainer = styled.div`
    align-items: left;
    margin-top: 1%;
    margin-left: 1%;
    margin-right: 1%;
    margin-bottom: 1%;
    width: 60%;
    background-color: #FFFFFF;
    padding: 0px;
    //color: #FFFFFF;
    font-family: Kanit wght;
    font-size: x-large;
    text-align: left;
    `

export const ImgContainer = styled.img`
    align-items: right;
    width: 30%;
    height: 30%;
    border-radius: 10px;
    margin-top: 1%;
    margin-left: 1%;
    margin-right: 1%;
    margin-bottom: 1%;
    `

export const EndStoryContainer = styled.div`
    font-family: Kanit wght;
    font-size: x-large;
    text-align: left;
    margin-top: 1%;
    margin-left: 1%;
    margin-right: 1%;
    margin-bottom: 1%;`