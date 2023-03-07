import styled, { keyframes } from 'styled-components';

export const CoinFlipContainer = styled.div`
    display: flex;
    border-radius: 4px;
    margin-left: 30%;
    margin-right: 30%;
    margin-top: 2%;
    margin-bottom: 2%;
    height: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;    
    background-color: #F5F5F5;
    padding: 20px;
    box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75);
    -webkit-box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75);
    -moz-box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75);

    button{

        margin: 5%;
        font-family: Arial, Helvetica, sans-serif;
        text-align: center;
        justify-content: center;
        background-color: #FFFFFF;

        display: flex;
  justify-content: center;
  min-width: 95px;
  height: unset;
  padding: 8px 24px;
  border-radius: 24px;
    }
        
`

export const OutcomContainer = styled.div`
    display: flex;
    border-radius: 4px;
    margin-left: 20%;
    margin-right: 20%;
    margin-top: 2%;
    margin-bottom: 2%;
    height: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;    
    background-color: #F5F5F5;
    padding: 20px;


        
`

export const Wrapper = styled.div`
    display: flex;
    padding: 4px;
    background-color: #9381FF;
`

export const CustomInput = styled.div`
    flex-grow: 1;
`

export const Label = styled.label``

export const RadioInput = styled.input.attrs({ type: "radio" })`
      display: none;
`

export const LabelInput = styled.span`
    display: block;
    padding: 6px 8px;
    color: #fff;
    font-weight: bold;
    text-align: center;
    transition : all .4s 0s ease;
    ${RadioInput}:checked + && {
      background-color: #f5f5f5;
      color: #000;
      border-radius: 4px;
    }
`




const flipHeads = keyframes`
  from {
    transform: rotateY(0);
  }
  to {
    transform: rotateY(720deg);
  }
`;

const flipTails = keyframes`
  from {
    transform: rotateY(0);
  }
  to {
    transform: rotateY(540deg);
  }
`;

const flipHeadsLoading = keyframes`
  from {
    transform: rotateY(0);
  }
  to {
    transform: rotateY(72000deg);
  }
`;



export const CoinWrapper = styled.div`
  position: relative;
  margin: 0 auto;
  width: 100px;
  height: 100px;

  transition: transform 1s ease-in;
  transform-style: preserve-3d;

  > div {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;

    box-shadow: inset 0 0 45px rgba(255, 255, 255, 0.3),
      0 12px 20px -10px rgba(0, 0, 0, 0.4);

    backface-visibility: hidden;

    &.side-a {
      background-color: #FFD700;
      color: white;
      text-align: center;
      
      z-index: 100;
    }

    &.side-b {
      background-color: #DAA520;
      color: white;
      text-align: center;
      transform: rotateY(-180deg);
    }
  }

  &.heads {
    animation: ${flipHeads} 2s ease-out forwards;
  }

  &.tails {
    animation: ${flipTails} 2s ease-out forwards;
  }


  &.loading {
    animation: ${flipHeadsLoading} 200s ease-out forwards;
  }
`;


  

  