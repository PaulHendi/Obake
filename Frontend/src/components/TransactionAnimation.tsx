import { TransactionStatus, useEthers, transactionErrored } from '@usedapp/core'
import React, { ReactElement, useEffect, useState } from 'react'
import styled from 'styled-components'
import { SpinnerIcon, CheckIcon, ExclamationIcon } from '../assets/Icons'

import { AnimatePresence, motion } from 'framer-motion'


// Note : This component was taken from the usedapp example

interface StatusBlockProps {
  color: string
  text: string
  icon: ReactElement
}

const StatusBlock = ({ color, text, icon }: StatusBlockProps) => (
  <InformationRow
    layout
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 50 }}
    key={text}
  >
    <IconContainer style={{ fill: color }}>{icon}</IconContainer>
    <div style={{ color: color, textAlign: 'center' }}>{text}</div>
  </InformationRow>
)

interface StatusAnimationProps {
  transaction: TransactionStatus
}

export const StatusAnimation = ({ transaction }: StatusAnimationProps) => {
  const [showTransactionStatus, setShowTransactionStatus] = useState(false)
  const [timer, setTimer] = useState(
    setTimeout(() => {
      void 0
    }, 1)
  )

  useEffect(() => {
    setShowTransactionStatus(true)
    clearTimeout(timer)

    if (transaction.status !== 'Mining' && transaction.status !== 'CollectingSignaturePool')
      setTimer(setTimeout(() => setShowTransactionStatus(false), 5000))
  }, [transaction])

  return (
    <AnimationWrapper>
      <AnimatePresence initial={false} mode="wait">
        {showTransactionStatus && transactionErrored(transaction) && (
          <StatusBlock
            color="red"
            text={transaction?.errorMessage || ''}
            icon={<ExclamationIcon />}
            key={transaction?.chainId + transaction.status}
          />
        )}
        {showTransactionStatus && transaction.status === 'Mining' && (
          <StatusBlock
            color="black"
            text="Transaction is being mined"
            icon={<SpinnerIcon />}
            key={transaction?.chainId + transaction.status}
          />
        )}
        {showTransactionStatus && transaction.status === 'CollectingSignaturePool' && (
          <StatusBlock
            color="black"
            text="Waiting for wallet owners to sign the transaction"
            icon={<SpinnerIcon />}
            key={transaction?.chainId + transaction.status}
          />
        )}
        {showTransactionStatus && transaction.status === 'Success' && (
          <StatusBlock
            color="green"
            text="Transaction successful"
            icon={<CheckIcon />}
            key={transaction?.chainId + transaction.status}
          />
        )}
      </AnimatePresence>
    </AnimationWrapper>
  )
}


const IconContainer = styled.div`
  margin-right: 15px;
  height: 40px;
  width: 40px;
  float: left;
`

const InformationRow = styled(motion.div)`
  height: 60px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: auto;
`

const AnimationWrapper = styled.div`
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  margin: 10px;
`