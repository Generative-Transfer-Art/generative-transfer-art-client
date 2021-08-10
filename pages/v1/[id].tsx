import Head from 'next/head'
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'
import { ethers } from "ethers";
import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router'
import V1DetailPage from "../../components/V1DetailPage"

export default function Tickets() {
  const router = useRouter()
  const { id } = router.query

  return (
  	<div>
  <V1DetailPage id={id} />
  </div>
  )
}