import styled from "styled-components";


export const StakingContainer = styled.div`

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

    
`





export const InputRow = styled.div`
    display: flex;
    margin: 0 auto;
    color: dark gray;
    border: gray 1px solid;
    border-radius: 24px;
    overflow: hidden;
    margin-top: 1%;
    margin-bottom: 5%;
    background-color: #F5F5F5;
`

export const Input = styled.input`
    width: 40%;
    text-align: center;
    
    border: 0;
    -moz-appearance: textfield;
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

`

export const Minus = styled.button`
    margin-left: 2%;
    width: 50px;
    color: black;
    font-size: 1rem;
    border: 0;
    background-color: #F5F5F5;
`
export const Plus = styled.button`
    width: 50px;
    color: black;
    font-size: 1rem;
    border: 0;
    background-color: #F5F5F5; 
`


export const SmallButton = styled.button`
  display: flex;
  justify-content: center;
  min-width: 95px;
  height: unset;
  padding: 8px 24px;
  border-radius: 24px;
`

export const ClaimButton = styled(SmallButton)`
    margin-bottom: 8%;
`


export const StakingSubContainer = styled.div`
    display: flex;
    border-radius: 4px;
    margin-left: 30%;
    margin-right: 30%;
    margin-top: 2%;
    height: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;    
    background-color: #F5F5F5;
`

export const ApproveContainer = styled.div`

    ${SmallButton} {
        margin-left: 35%;
    }
  
`
