'use client'

import React from "react";
import { ChangeEvent } from "react";

type Complexity = "low" | "medium" | "high"

interface SacapFee {
  from: number
  primary_fee: number
  percent: number
}

const sacapFees: Record<Complexity, SacapFee[]> = {
  "low": [
    {
      "from": 1,
      "primary_fee": 11341.85,
      "percent": 0.1753
    },
    {
      "from": 200001,
      "primary_fee": 46393.33,
      "percent": 0.1685
    },
    {
      "from": 650001,
      "primary_fee": 122193.97,
      "percent": 0.1243
    },
    {
      "from": 2000001,
      "primary_fee": 289927.74,
      "percent": 0.1083
    },
    {
      "from": 4000001,
      "primary_fee": 506559.8,
      "percent": 0.1055
    },
    {
      "from": 6500001,
      "primary_fee": 770251.28,
      "percent": 0.0916
    },
    {
      "from": 13000001,
      "primary_fee": 1365321.64,
      "percent": 0.0886
    },
    {
      "from": 40000001,
      "primary_fee": 3755421.23,
      "percent": 0.0885
    },
    {
      "from": 130000001,
      "primary_fee": 11717437.86,
      "percent": 0.0828
    },
    {
      "from": 260000001,
      "primary_fee": 22475739.42,
      "percent": 0.0808
    },
    {
      "from": 520000001,
      "primary_fee": 43501431.14,
      "percent": 0.0788
    },
    {
      "from": 1040000001,
      "primary_fee": 84483711.59,
      "percent": 0.0728
    }
  ],
  "medium": [
    {
      "from": 1,
      "primary_fee": 13570.07,
      "percent": 0.2096
    },
    {
      "from": 200001,
      "primary_fee": 55507.74,
      "percent": 0.2016
    },
    {
      "from": 650001,
      "primary_fee": 146200.15,
      "percent": 0.1487
    },
    {
      "from": 2000001,
      "primary_fee": 346886.84,
      "percent": 0.1296
    },
    {
      "from": 4000001,
      "primary_fee": 606078.35,
      "percent": 0.1262
    },
    {
      "from": 6500001,
      "primary_fee": 921574.57,
      "percent": 0.1095
    },
    {
      "from": 13000001,
      "primary_fee": 1633552.23,
      "percent": 0.106
    },
    {
      "from": 40000001,
      "primary_fee": 4493209.93,
      "percent": 0.1059
    },
    {
      "from": 130000001,
      "primary_fee": 14019441.47,
      "percent": 0.0991
    },
    {
      "from": 260000001,
      "primary_fee": 26891315.09,
      "percent": 0.0968
    },
    {
      "from": 520000001,
      "primary_fee": 52047706.61,
      "percent": 0.0943
    },
    {
      "from": 1040000001,
      "primary_fee": 101081351.13,
      "percent": 0.0871
    }
  ],
  "high": [
    {
      "from": 1,
      "primary_fee": 15798.28,
      "percent": 0.2441
    },
    {
      "from": 200001,
      "primary_fee": 64622.16,
      "percent": 0.2347
    },
    {
      "from": 650001,
      "primary_fee": 170206.35,
      "percent": 0.1731
    },
    {
      "from": 2000001,
      "primary_fee": 403845.93,
      "percent": 0.1509
    },
    {
      "from": 4000001,
      "primary_fee": 705596.92,
      "percent": 0.1469
    },
    {
      "from": 6500001,
      "primary_fee": 1072897.87,
      "percent": 0.1276
    },
    {
      "from": 13000001,
      "primary_fee": 1901782.84,
      "percent": 0.1233
    },
    {
      "from": 40000001,
      "primary_fee": 5230998.63,
      "percent": 0.1233
    },
    {
      "from": 130000001,
      "primary_fee": 16321445.09,
      "percent": 0.1152
    },
    {
      "from": 260000001,
      "primary_fee": 31306890.75,
      "percent": 0.1126
    },
    {
      "from": 520000001,
      "primary_fee": 60593982.1,
      "percent": 0.1098
    },
    {
      "from": 1040000001,
      "primary_fee": 117678990.65,
      "percent": 0.1016
    }
  ]
}

const calculateSacapFee = (budget: number, complexity: Complexity) => {
  const fees = sacapFees[complexity]
  const sortedFees = fees.sort((a, b) => a.from > b.from ? 1 : -1)
  const applicableFee = sortedFees.find((fee) => fee.from >= budget)
  if (applicableFee === undefined) {
    throw new Error("No applicable SACAP fee for that budget")
  }
  return applicableFee.primary_fee + (budget - applicableFee.from) * applicableFee.percent
}

const calculateFee = (budget: number, complexity: Complexity) => {
  if (budget < 1.0) {
    throw new Error("Budget must be at least 1.0")
  }

  const jvdFactor = 0.5
  return jvdFactor * calculateSacapFee(budget, complexity)
}

const formatFee = (fee: number) => {
  const roundedFee = Math.round(fee * 100.0) / 100.0
  return roundedFee.toLocaleString()
}

export default function Home() {
  const [budget, setBudget] = React.useState(100_000.0)

  const onChange = React.useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const newBudget = parseFloat(event.target.value)
    if (newBudget >= 1.0) {
      setBudget(newBudget)
    }
  }, [setBudget])

  return (
    <div className="max-w-md text-sm p-4">
      <h2 className="text-2xl font-bold mb-4">Fee Calculator</h2>
      <label htmlFor="budget">Budget (ZAR): &nbsp;</label>
      <input id="budget" type="number" min={1} value={budget} onChange={onChange} className="text-black text-right" />

      <h3 className="text-xl font-bold mt-2">Results:</h3>
      <div className="grid grid-cols-2">
        <div className="py-2">Low Complexity Fee</div>
        <div className="py-2">R {formatFee(calculateSacapFee(budget, "low"))}</div>

        <div className="py-2">Low Complexity JVD Fee</div>
        <div className="py-2">R {formatFee(calculateFee(budget, "low"))}</div>

        <div className="py-2">Medium Complexity Fee</div>
        <div className="py-2">R {formatFee(calculateSacapFee(budget, "medium"))}</div>

        <div className="py-2">Medium Complexity JVD Fee</div>
        <div className="py-2">R {formatFee(calculateFee(budget, "medium"))}</div>
      </div>
    </div>
  );
}
