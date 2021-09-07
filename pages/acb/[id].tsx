import Head from 'next/head'
import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router'
import AnimalColoringBookDetailView from '../../components/AnimalColoringBook/TokenPage/AnimalColoringBookDetailView';

export default function Tickets() {
  const router = useRouter()
  const { id } = router.query

  return (
  	<div id="home-wrapper">
      <AnimalColoringBookDetailView id={id} />
  </div>
  )
}