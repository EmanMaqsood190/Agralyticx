import React, { useState } from 'react';
import {
  Calculator,
  CircleDollarSign,
  Fuel,
  LandPlot,
  Percent,
  TrendingUp,
  Truck,
  Wallet,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

type CalculatorMode =
  | 'cropBudget'
  | 'profitLoss'
  | 'breakEven'
  | 'loan'
  | 'machinery'
  | 'transport';

type Values = Record<string, string>;

type Result = {
  label: string;
  value: number;
  suffix?: string;
};

type CropOption = {
  value: string;
  label: string;
};

const inputClass =
  'w-full rounded-xl border border-[#DDE8DD] bg-white px-4 py-3 text-sm text-[#1F2933] placeholder:text-[#9AA69D] outline-none transition focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/20';

const calculatorModes: CalculatorMode[] = [
  'cropBudget',
  'profitLoss',
  'breakEven',
  'loan',
  'machinery',
  'transport',
];

const getNumber = (values: Values, key: string): number => {
  const value = Number(values[key]);
  return Number.isFinite(value) ? value : 0;
};

const formatNumber = (value: number): string =>
  new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 2,
  }).format(value);

export const FinanceDirectory: React.FC = () => {
  const { t } = useLanguage();

  const [mode, setMode] = useState<CalculatorMode>('cropBudget');
  const [crop, setCrop] = useState('');
  const [customCrop, setCustomCrop] = useState('');
  const [values, setValues] = useState<Values>({});
  const [results, setResults] = useState<Result[]>([]);
  const [error, setError] = useState('');

  const crops: CropOption[] = [
    { value: 'wheat', label: t.financeCropWheat },
    { value: 'rice', label: t.financeCropRice },
    { value: 'cotton', label: t.financeCropCotton },
    { value: 'maize', label: t.financeCropMaize },
    { value: 'sugarcane', label: t.financeCropSugarcane },
    { value: 'potato', label: t.financeCropPotato },
    { value: 'onion', label: t.financeCropOnion },
    { value: 'tomato', label: t.financeCropTomato },
    { value: 'mustard', label: t.financeCropMustard },
    { value: 'chickpea', label: t.financeCropChickpea },
    { value: 'groundnut', label: t.financeCropGroundnut },
    { value: 'other', label: t.financeCropCustom },
  ];

  const cropRequired =
    mode === 'cropBudget' ||
    mode === 'profitLoss' ||
    mode === 'breakEven';

  const selectedCropName =
    crop === 'other'
      ? customCrop.trim()
      : crops.find((item) => item.value === crop)?.label || '';

  const updateValue = (key: string, value: string) => {
    setValues((previous) => ({
      ...previous,
      [key]: value,
    }));

    setResults([]);
    setError('');
  };

  const changeMode = (nextMode: CalculatorMode) => {
    setMode(nextMode);
    setCrop('');
    setCustomCrop('');
    setValues({});
    setResults([]);
    setError('');
  };

  const clear = () => {
    setCrop('');
    setCustomCrop('');
    setValues({});
    setResults([]);
    setError('');
  };

  const requireFields = (fields: string[]) => {
    if (fields.some((field) => values[field]?.trim() === '')) {
      setError(t.financeRequiredFields);
      return false;
    }

    return true;
  };

  const requireCrop = () => {
    if (!crop) {
      setError(t.financeSelectCropError);
      return false;
    }

    if (crop === 'other' && !customCrop.trim()) {
      setError(t.financeCustomCropError);
      return false;
    }

    return true;
  };

  const calculate = () => {
    setResults([]);
    setError('');

    if (cropRequired && !requireCrop()) {
      return;
    }

    // -----------------------------------------
    // CROP BUDGET
    // -----------------------------------------
    if (mode === 'cropBudget') {
      if (
        !requireFields([
          'landArea',
          'seed',
          'fertilizer',
          'pesticide',
          'labor',
          'irrigation',
          'machinery',
          'transport',
          'other',
        ])
      ) {
        return;
      }

      const landArea = getNumber(values, 'landArea');

      if (landArea <= 0) {
        setError(t.financePositiveLandArea);
        return;
      }

      const total =
        getNumber(values, 'seed') +
        getNumber(values, 'fertilizer') +
        getNumber(values, 'pesticide') +
        getNumber(values, 'labor') +
        getNumber(values, 'irrigation') +
        getNumber(values, 'machinery') +
        getNumber(values, 'transport') +
        getNumber(values, 'other');

      setResults([
        {
          label: t.financeTotalCropBudget,
          value: total,
        },
        {
          label: t.financeCostPerAcre,
          value: total / landArea,
        },
      ]);

      return;
    }

    // -----------------------------------------
    // PROFIT / LOSS
    // -----------------------------------------
    if (mode === 'profitLoss') {
      if (
        !requireFields([
          'totalCost',
          'yield',
          'sellingPrice',
        ])
      ) {
        return;
      }

      const totalCost =
        getNumber(values, 'totalCost');

      const expectedYield =
        getNumber(values, 'yield');

      const sellingPrice =
        getNumber(values, 'sellingPrice');

      if (expectedYield <= 0) {
        setError(t.financePositiveYield);
        return;
      }

      const revenue =
        expectedYield * sellingPrice;

      const difference =
        revenue - totalCost;

      const calculatedResults: Result[] = [
        {
          label: t.financeExpectedRevenue,
          value: revenue,
        },
        {
          label:
            difference >= 0
              ? t.financeExpectedProfit
              : t.financeExpectedLoss,
          value: Math.abs(difference),
        },
      ];

      if (revenue > 0) {
        calculatedResults.push({
          label: t.financeProfitMargin,
          value:
            (difference / revenue) * 100,
          suffix: '%',
        });
      }

      setResults(calculatedResults);

      return;
    }

    // -----------------------------------------
    // BREAK EVEN
    // -----------------------------------------
    if (mode === 'breakEven') {
      if (
        !requireFields([
          'totalCost',
          'yield',
        ])
      ) {
        return;
      }

      const totalCost =
        getNumber(values, 'totalCost');

      const expectedYield =
        getNumber(values, 'yield');

      if (expectedYield <= 0) {
        setError(t.financePositiveYield);
        return;
      }

      setResults([
        {
          label:
            t.financeBreakEvenSellingPrice,
          value:
            totalCost / expectedYield,
        },
      ]);

      return;
    }

    // -----------------------------------------
    // FARM LOAN EMI
    // -----------------------------------------
    if (mode === 'loan') {
      if (
        !requireFields([
          'principal',
          'rate',
          'months',
        ])
      ) {
        return;
      }

      const principal =
        getNumber(values, 'principal');

      const annualRate =
        getNumber(values, 'rate');

      const months =
        getNumber(values, 'months');

      if (
        principal <= 0 ||
        months <= 0
      ) {
        setError(t.financePositiveLoan);
        return;
      }

      const monthlyRate =
        annualRate / 100 / 12;

      const emi =
        monthlyRate === 0
          ? principal / months
          : (
              principal *
              monthlyRate *
              Math.pow(
                1 + monthlyRate,
                months
              )
            ) /
            (
              Math.pow(
                1 + monthlyRate,
                months
              ) - 1
            );

      const totalRepayment =
        emi * months;

      const totalInterest =
        totalRepayment - principal;

      setResults([
        {
          label: t.financeMonthlyEMI,
          value: emi,
        },
        {
          label: t.financeTotalRepayment,
          value: totalRepayment,
        },
        {
          label: t.financeTotalInterest,
          value: Math.max(
            0,
            totalInterest
          ),
        },
      ]);

      return;
    }

    // -----------------------------------------
    // MACHINERY / FUEL
    // -----------------------------------------
    if (mode === 'machinery') {
      if (
        !requireFields([
          'hours',
          'fuelPerHour',
          'fuelPrice',
          'operator',
          'other',
        ])
      ) {
        return;
      }

      const hours =
        getNumber(values, 'hours');

      if (hours <= 0) {
        setError(t.financePositiveHours);
        return;
      }

      const fuelCost =
        hours *
        getNumber(
          values,
          'fuelPerHour'
        ) *
        getNumber(
          values,
          'fuelPrice'
        );

      const operatorCost =
        hours *
        getNumber(
          values,
          'operator'
        );

      const total =
        fuelCost +
        operatorCost +
        getNumber(
          values,
          'other'
        );

      setResults([
        {
          label:
            t.financeTotalMachineCost,
          value: total,
        },
        {
          label:
            t.financeCostPerMachineHour,
          value:
            total / hours,
        },
      ]);

      return;
    }

    // -----------------------------------------
    // TRANSPORT
    // -----------------------------------------
    if (mode === 'transport') {
      if (
        !requireFields([
          'distance',
          'trips',
          'costPerKm',
          'loading',
          'other',
        ])
      ) {
        return;
      }

      const distance =
        getNumber(
          values,
          'distance'
        );

      const trips =
        getNumber(
          values,
          'trips'
        );

      if (
        distance <= 0 ||
        trips <= 0
      ) {
        setError(
          t.financePositiveTransport
        );
        return;
      }

      const vehicleCost =
        distance *
        trips *
        getNumber(
          values,
          'costPerKm'
        );

      const loadingCost =
        trips *
        getNumber(
          values,
          'loading'
        );

      const total =
        vehicleCost +
        loadingCost +
        getNumber(
          values,
          'other'
        );

      setResults([
        {
          label:
            t.financeTotalTransportCost,
          value: total,
        },
        {
          label:
            t.financeCostPerTrip,
          value:
            total / trips,
        },
      ]);
    }
  };

  const renderInput = (
    key: string,
    label: string,
    placeholder: string,
    unit?: string
  ) => (
    <div>
      <label
        htmlFor={`finance-${key}`}
        className="block text-xs font-bold text-[#1F2933] mb-1.5"
      >
        {label}
        {unit ? ` (${unit})` : ''}
      </label>

      <input
        id={`finance-${key}`}
        type="number"
        min="0"
        step="any"
        inputMode="decimal"
        value={values[key] ?? ''}
        onChange={(event) =>
          updateValue(
            key,
            event.target.value
          )
        }
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );

  const modeInfo = {
    cropBudget: {
      icon: (
        <Wallet className="w-5 h-5" />
      ),
      title: t.financeCropBudget,
      description:
        t.financeCropBudgetDesc,
    },

    profitLoss: {
      icon: (
        <TrendingUp className="w-5 h-5" />
      ),
      title: t.financeProfitLoss,
      description:
        t.financeProfitLossDesc,
    },

    breakEven: {
      icon: (
        <CircleDollarSign className="w-5 h-5" />
      ),
      title: t.financeBreakEven,
      description:
        t.financeBreakEvenDesc,
    },

    loan: {
      icon: (
        <Percent className="w-5 h-5" />
      ),
      title: t.financeLoanEMI,
      description:
        t.financeLoanEMIDesc,
    },

    machinery: {
      icon: (
        <Fuel className="w-5 h-5" />
      ),
      title: t.financeMachinery,
      description:
        t.financeMachineryDesc,
    },

    transport: {
      icon: (
        <Truck className="w-5 h-5" />
      ),
      title: t.financeTransport,
      description:
        t.financeTransportDesc,
    },
  }[mode];

  const renderFields = () => {
    switch (mode) {
      case 'cropBudget':
        return (
          <>
            {renderInput(
              'landArea',
              t.financeLandArea,
              t.financeEnterArea,
              t.financeAcres
            )}

            {renderInput(
              'seed',
              t.financeSeedCost,
              t.financeEnterAmount
            )}

            {renderInput(
              'fertilizer',
              t.financeFertilizer,
              t.financeEnterAmount
            )}

            {renderInput(
              'pesticide',
              t.financePesticide,
              t.financeEnterAmount
            )}

            {renderInput(
              'labor',
              t.financeLabor,
              t.financeEnterAmount
            )}

            {renderInput(
              'irrigation',
              t.financeIrrigation,
              t.financeEnterAmount
            )}

            {renderInput(
              'machinery',
              t.financeMachineryField,
              t.financeEnterAmount
            )}

            {renderInput(
              'transport',
              t.financeTransportField,
              t.financeEnterAmount
            )}

            {renderInput(
              'other',
              t.financeOtherCosts,
              t.financeEnterAmount
            )}
          </>
        );

      case 'profitLoss':
        return (
          <>
            {renderInput(
              'totalCost',
              t.financeTotalProductionCost,
              t.financeEnterTotalCost
            )}

            {renderInput(
              'yield',
              t.financeExpectedYield,
              t.financeEnterYield,
              t.financeUnits
            )}

            {renderInput(
              'sellingPrice',
              t.financeSellingPrice,
              t.financeEnterPricePerUnit
            )}
          </>
        );

      case 'breakEven':
        return (
          <>
            {renderInput(
              'totalCost',
              t.financeTotalProductionCost,
              t.financeEnterTotalCost
            )}

            {renderInput(
              'yield',
              t.financeSaleableYield,
              t.financeEnterYield,
              t.financeUnits
            )}
          </>
        );

      case 'loan':
        return (
          <>
            {renderInput(
              'principal',
              t.financeLoanAmount,
              t.financeEnterLoanAmount
            )}

            {renderInput(
              'rate',
              t.financeAnnualRate,
              t.financeEnterRate,
              '%'
            )}

            {renderInput(
              'months',
              t.financeLoanTerm,
              t.financeEnterMonths,
              t.financeMonths
            )}
          </>
        );

      case 'machinery':
        return (
          <>
            {renderInput(
              'hours',
              t.financeMachineHours,
              t.financeEnterHours,
              t.financeHours
            )}

            {renderInput(
              'fuelPerHour',
              t.financeFuelPerHour,
              t.financeEnterFuelUse,
              t.financeLitresPerHour
            )}

            {renderInput(
              'fuelPrice',
              t.financeFuelPrice,
              t.financeEnterFuelPrice
            )}

            {renderInput(
              'operator',
              t.financeOperatorCost,
              t.financeEnterHourlyCost
            )}

            {renderInput(
              'other',
              t.financeOtherMachineCosts,
              t.financeEnterAmount
            )}
          </>
        );

      case 'transport':
        return (
          <>
            {renderInput(
              'distance',
              t.financeDistance,
              t.financeEnterDistance,
              t.financeKm
            )}

            {renderInput(
              'trips',
              t.financeTrips,
              t.financeEnterTrips
            )}

            {renderInput(
              'costPerKm',
              t.financeVehicleCostPerKm,
              t.financeEnterCostPerKm
            )}

            {renderInput(
              'loading',
              t.financeLoadingCost,
              t.financeEnterLoadingCost
            )}

            {renderInput(
              'other',
              t.financeOtherTransportCosts,
              t.financeEnterAmount
            )}
          </>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="glass-card rounded-3xl border border-[#DDE8DD] bg-white/90 shadow-sm overflow-hidden">

        {/* HEADER */}
        <div className="p-6 sm:p-8 border-b border-[#DDE8DD]">
          <div className="flex items-start gap-4">

            <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shrink-0">
              <Calculator className="w-6 h-6" />
            </div>

            <div>
              <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32]">
                <LandPlot className="w-4 h-4" />
                {t.financeFarmerTool}
              </span>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1F2933] mt-3">
                {t.financeCalculatorTitle}
              </h1>

              <p className="text-sm text-[#5F6B63] mt-2 max-w-2xl">
                {t.financeCalculatorSubtitle}
              </p>
            </div>

          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">

          {/* CALCULATOR SELECTOR */}
          <div>
            <label
              htmlFor="finance-calculator-type"
              className="block text-sm font-bold text-[#1F2933] mb-2"
            >
              {t.financeChooseCalculator}
            </label>

            <select
              id="finance-calculator-type"
              value={mode}
              onChange={(event) =>
                changeMode(
                  event.target.value as CalculatorMode
                )
              }
              className={inputClass}
            >
              {calculatorModes.map(
                (calculatorMode) => (
                  <option
                    key={calculatorMode}
                    value={calculatorMode}
                  >
                    {modeInfoFor(
                      calculatorMode,
                      t
                    )}
                  </option>
                )
              )}
            </select>
          </div>

          {/* CROP SELECTOR */}
          {cropRequired && (
            <div className="rounded-2xl border border-[#DDE8DD] bg-[#F8FAF7] p-4 sm:p-5">

              <label
                htmlFor="finance-crop"
                className="block text-sm font-bold text-[#1F2933] mb-2"
              >
                {t.financeCrop}
              </label>

              <select
                id="finance-crop"
                value={crop}
                onChange={(event) => {
                  setCrop(
                    event.target.value
                  );
                  setCustomCrop('');
                  setResults([]);
                  setError('');
                }}
                className={inputClass}
              >
                <option value="">
                  {t.financeSelectCrop}
                </option>

                {crops.map((item) => (
                  <option
                    key={item.value}
                    value={item.value}
                  >
                    {item.label}
                  </option>
                ))}
              </select>

              {/* CUSTOM CROP */}
              {crop === 'other' && (
                <input
                  type="text"
                  value={customCrop}
                  onChange={(event) => {
                    setCustomCrop(
                      event.target.value
                    );
                    setResults([]);
                    setError('');
                  }}
                  placeholder={
                    t.financeCustomCropPlaceholder
                  }
                  className={`${inputClass} mt-3`}
                />
              )}

              {selectedCropName && (
                <p className="text-xs text-[#5F6B63] mt-2">
                  {t.financeSelectedCrop}:{' '}
                  {selectedCropName}
                </p>
              )}

            </div>
          )}

          {/* INPUT BOX */}
          <div className="rounded-2xl bg-[#F8FAF7] border border-[#DDE8DD] p-4 sm:p-5">

            <div className="flex items-start gap-3 mb-5">

              <div className="w-10 h-10 rounded-xl bg-white border border-[#DDE8DD] text-[#2E7D32] flex items-center justify-center shrink-0">
                {modeInfo.icon}
              </div>

              <div>
                <h2 className="font-extrabold text-[#1F2933]">
                  {modeInfo.title}
                </h2>

                <p className="text-xs text-[#5F6B63] mt-1">
                  {modeInfo.description}
                </p>
              </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderFields()}
            </div>

            {/* ERROR */}
            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">

              <button
                type="button"
                onClick={calculate}
                className="flex-1 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold py-3 px-5 transition-colors flex items-center justify-center gap-2"
              >
                <Calculator className="w-4 h-4" />
                {t.financeCalculate}
              </button>

              <button
                type="button"
                onClick={clear}
                className="rounded-xl border border-[#DDE8DD] bg-white text-[#2E7D32] hover:bg-[#E8F5E9] font-bold py-3 px-6 transition-colors"
              >
                {t.financeClear}
              </button>

            </div>

            <p className="text-[11px] text-[#6B776F] mt-3">
              {t.financeEmptyNotice}
            </p>

          </div>

          {/* RESULTS */}
          {results.length > 0 && (
            <div className="rounded-2xl border border-[#B9DDBB] bg-[#E8F5E9]/60 p-5">

              <h2 className="text-sm font-extrabold text-[#1F2933] mb-4">
                {t.financeResults}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

                {results.map((result) => (
                  <div
                    key={result.label}
                    className="rounded-xl bg-white border border-[#DDE8DD] p-4"
                  >
                    <p className="text-xs font-semibold text-[#5F6B63]">
                      {result.label}
                    </p>

                    <p className="text-xl font-extrabold text-[#2E7D32] mt-1">
                      {formatNumber(
                        result.value
                      )}
                      {result.suffix || ''}
                    </p>
                  </div>
                ))}

              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

function modeInfoFor(
  mode: CalculatorMode,
  t: any
): string {
  switch (mode) {
    case 'cropBudget':
      return t.financeCropBudget;

    case 'profitLoss':
      return t.financeProfitLoss;

    case 'breakEven':
      return t.financeBreakEven;

    case 'loan':
      return t.financeLoanEMI;

    case 'machinery':
      return t.financeMachinery;

    case 'transport':
      return t.financeTransport;
  }
}