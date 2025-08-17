import React from 'react'
import { getBedTypeLabel } from '@/lib/client-utils'
import type { Locale } from '@/lib/translations'

interface BedTypeTestProps {
  locale: Locale
}

const BedTypeTest: React.FC<BedTypeTestProps> = ({ locale }) => {
  const testBedTypes = [
    'single',
    'double', 
    'queen',
    'king',
    'twin',
    'bunk',
    'dos camas',
    'two beds',
    'individual',
    'doble',
    'litera',
    'single bed',
    'double bed',
    'twin beds',
    'bunk beds',
    '1 bed',
    '2 beds',
    'one bed',
    'two bed'
  ]

}

export default BedTypeTest
