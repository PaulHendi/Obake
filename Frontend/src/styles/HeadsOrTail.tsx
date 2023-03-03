import styled from 'styled-components';

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


// Not used yet
export const Coin = styled.button`
    border-radius : 100%;
    border-style: solid;
    width: 100px;
    height: 100px;
    margin-left: 10px;
    background-color:gold;

    &:hover{
        
            transform: rotate(180deg) scale(1) skew(0deg) translate(-100px);
            transition: 1s;
        }

` 