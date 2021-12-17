import Head from 'next/head'
import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router'
import AnimalColoringBookDetailView from '../../../components/AnimalColoringBook/TokenPage/OptimismDetailView';

export default function Tickets() {
  const router = useRouter()
  const { id } = router.query

  return (
  	<div id="home-wrapper">
          <h1> MAKE SURE YOU ARE ON OPTIMISM NETWORK IN YOUR WALLET </h1>
      <AnimalColoringBookDetailView id={id} />
  </div>
  )
}