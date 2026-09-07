import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sprout,
  ArrowLeft,
  Save,
  Check,
  Edit3,
  Plus,
  Trash2,
  X,
  MapPin,
  Ruler,
  Droplets,
  Layers
} from 'lucide-react';

import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../auth/AuthContext';
import { db } from '../../services/db';
import { FarmData } from '../../types';

type StoredFarm = FarmData & {
  farmId: string;
};

export const MyFarm: React.FC = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  // ============================================================
  // STATE
  // ============================================================

  const [farms, setFarms] =
    useState<StoredFarm[]>([]);

  const [isEditing, setIsEditing] =
    useState(false);

  const [editingFarmId, setEditingFarmId] =
    useState<string | null>(null);

  const [showDeleteConfirm, setShowDeleteConfirm] =
    useState(false);

  const [farmToDelete, setFarmToDelete] =
    useState<StoredFarm | null>(null);

  const [saveSuccess, setSaveSuccess] =
    useState(false);

  const [deleteSuccess, setDeleteSuccess] =
    useState(false);

  // Form
  const [location, setLocation] =
    useState('');

  const [district, setDistrict] =
    useState('');

  const [totalAcres, setTotalAcres] =
    useState<number>(5);

  const [mainCrops, setMainCrops] =
    useState('');

  const [soilType, setSoilType] =
    useState<string>('Loamy');

  const [waterSource, setWaterSource] =
    useState<FarmData['waterSource']>(
      'Canal'
    );

  // ============================================================
  // TRANSLATIONS
  // ============================================================

  const text = {
    en: {
      addFarm:
        'Add Farm',

      addAnotherFarm:
        'Add Another Farm',

      editFarm:
        'Edit Farm',

      district:
        'District',

      location:
        'Farm Location',

      locationPlaceholder:
        'e.g. Chak 42 RB, Tehsil Kot Momin',

      districtPlaceholder:
        'e.g. Sargodha / Multan',

      farmSize:
        'Farm Size (Acres)',

      waterSource:
        'Water / Irrigation Source',

      soilType:
        'Soil Type',

      selectSoil:
        'Select soil type',

      mainCrops:
        'Main Crops Cultivated',

      commaSeparated:
        '(comma separated)',

      cropsPlaceholder:
        'Wheat, Cotton, Rice, Corn, Sugarcane',

      loamy:
        'Loamy',

      sandy:
        'Sandy',

      clay:
        'Clay',

      silty:
        'Silty',

      sandyLoam:
        'Sandy Loam',

      clayLoam:
        'Clay Loam',

      canal:
        'Canal Water',

      tubeWell:
        'Tube-well',

      solarTubeWell:
        'Solar Tube-well',

      rainfed:
        'Rainfed / Barani',

      mixed:
        'Mixed (Canal + Tube-well)',

      registeredFarm:
        'Registered Farm Parcel',

      acres:
        'Acres',

      noFarm:
        'No farm information added yet.',


      save:
        'Save Farm',

      update:
        'Update Farm',

      cancel:
        'Cancel',

      edit:
        'Edit',

      delete:
        'Delete',

      deleteTitle:
        'Delete Farm?',

      deleteMessage:
        'Are you sure you want to delete this farm? This action cannot be undone.',

      confirmDelete:
        'Delete Farm',

      farmSaved:
        'Farm information saved successfully.',

      farmUpdated:
        'Farm information updated successfully.',

      farmDeleted:
        'Farm deleted successfully.',

      back:
        'Back'
    },

    ur: {
      addFarm:
        'فارم شامل کریں',

      addAnotherFarm:
        'ایک اور فارم شامل کریں',

      editFarm:
        'فارم میں ترمیم کریں',

      district:
        'ضلع',

      location:
        'فارم کا مقام',

      locationPlaceholder:
        'مثال: چک 42 آر بی، تحصیل کوٹ مومن',

      districtPlaceholder:
        'مثال: سرگودھا / ملتان',

      farmSize:
        'فارم کا رقبہ (ایکڑ)',

      waterSource:
        'پانی / آبپاشی کا ذریعہ',

      soilType:
        'مٹی کی قسم',

      selectSoil:
        'مٹی کی قسم منتخب کریں',

      mainCrops:
        'کاشت کی جانے والی اہم فصلیں',

      commaSeparated:
        '(کاما سے الگ کریں)',

      cropsPlaceholder:
        'گندم، کپاس، چاول، مکئی، گنا',

      loamy:
        'میرا',

      sandy:
        'ریتلی',

      clay:
        'چکنی',

      silty:
        'گاد والی',

      sandyLoam:
        'ریتلی میرا',

      clayLoam:
        'چکنی میرا',

      canal:
        'نہری پانی',

      tubeWell:
        'ٹیوب ویل',

      solarTubeWell:
        'سولر ٹیوب ویل',

      rainfed:
        'بارانی',

      mixed:
        'نہری پانی + ٹیوب ویل',

      registeredFarm:
        'رجسٹرڈ فارم',

      acres:
        'ایکڑ',

      noFarm:
        'ابھی کوئی فارم شامل نہیں کیا گیا۔',

    
      save:
        'فارم محفوظ کریں',

      update:
        'فارم اپ ڈیٹ کریں',

      cancel:
        'منسوخ کریں',

      edit:
        'ترمیم',

      delete:
        'حذف کریں',

      deleteTitle:
        'فارم حذف کریں؟',

      deleteMessage:
        'کیا آپ واقعی یہ فارم حذف کرنا چاہتے ہیں؟ یہ عمل واپس نہیں کیا جا سکتا۔',

      confirmDelete:
        'فارم حذف کریں',

      farmSaved:
        'فارم کی معلومات کامیابی سے محفوظ ہو گئی ہیں۔',

      farmUpdated:
        'فارم کی معلومات کامیابی سے اپ ڈیٹ ہو گئی ہیں۔',

      farmDeleted:
        'فارم کامیابی سے حذف ہو گیا ہے۔',

      back:
        'واپس'
    },

    pa: {
      addFarm:
        'فارم شامل کرو',

      addAnotherFarm:
        'ہک ہور فارم شامل کرو',

      editFarm:
        'فارم وچ ترمیم کرو',

      district:
        'ضلع',

      location:
        'فارم دا مقام',

      locationPlaceholder:
        'مثال: چک 42 آر بی، تحصیل کوٹ مومن',

      districtPlaceholder:
        'مثال: سرگودھا / ملتان',

      farmSize:
        'فارم دا رقبہ (ایکڑ)',

      waterSource:
        'پانی / آبپاشی دا ذریعہ',

      soilType:
        'مٹی دی قسم',

      selectSoil:
        'مٹی دی قسم چنو',

      mainCrops:
        'کاشت کیتیاں جان والیاں اہم فصلیں',

      commaSeparated:
        '(کاما نال الگ کرو)',

      cropsPlaceholder:
        'گندم، کپاہ، چاول، مکئی، گنا',

      loamy:
        'میری مٹی',

      sandy:
        'ریتلی مٹی',

      clay:
        'چکنی مٹی',

      silty:
        'گاد والی مٹی',

      sandyLoam:
        'ریتلی میری مٹی',

      clayLoam:
        'چکنی میری مٹی',

      canal:
        'نہری پانی',

      tubeWell:
        'ٹیوب ویل',

      solarTubeWell:
        'سولر ٹیوب ویل',

      rainfed:
        'بارانی',

      mixed:
        'نہری پانی + ٹیوب ویل',

      registeredFarm:
        'رجسٹرڈ فارم',

      acres:
        'ایکڑ',

      noFarm:
        'ہن تک کوئی فارم شامل نہیں کیتا گیا۔',


      save:
        'فارم محفوظ کرو',

      update:
        'فارم اپ ڈیٹ کرو',

      cancel:
        'منسوخ کرو',

      edit:
        'ترمیم',

      delete:
        'حذف کرو',

      deleteTitle:
        'فارم حذف کرنا اے؟',

      deleteMessage:
        'کی تسی واقعی ایہہ فارم حذف کرنا چاہندے او؟ ایہہ عمل واپس نہیں کیتا جا سکدا۔',

      confirmDelete:
        'فارم حذف کرو',

      farmSaved:
        'فارم دی معلومات کامیابی نال محفوظ ہو گئی اے۔',

      farmUpdated:
        'فارم دی معلومات کامیابی نال اپ ڈیٹ ہو گئی اے۔',

      farmDeleted:
        'فارم کامیابی نال حذف ہو گیا اے۔',

      back:
        'واپس'
    }
  };

  const currentText =
    text[
      language as
        | 'en'
        | 'ur'
        | 'pa'
    ] || text.en;

  // ============================================================
  // LABELS
  // ============================================================

  const waterLabels = {
    Canal:
      currentText.canal,

    'Tube-well':
      currentText.tubeWell,

    'Solar Tube-well':
      currentText.solarTubeWell,

    Rainfed:
      currentText.rainfed,

    Mixed:
      currentText.mixed
  };

  const soilLabels = {
    Loamy:
      currentText.loamy,

    Sandy:
      currentText.sandy,

    Clay:
      currentText.clay,

    Silty:
      currentText.silty,

    'Sandy Loam':
      currentText.sandyLoam,

    'Clay Loam':
      currentText.clayLoam
  };

  // ============================================================
  // LOAD ALL FARMS
  // ============================================================

  useEffect(() => {
    if (!user) return;

    const data =
      db.getAllFarmData(
        user.userId
      );

    setFarms(data);
  }, [user]);

  // ============================================================
  // RESET FORM
  // ============================================================

  const resetForm = () => {
    setLocation('');
    setDistrict('');
    setTotalAcres(5);
    setMainCrops('');
    setSoilType('Loamy');
    setWaterSource('Canal');
    setEditingFarmId(null);
  };

  // ============================================================
  // ADD FARM
  // ============================================================

  const handleAddFarm = () => {
    resetForm();
    setIsEditing(true);
  };

  // ============================================================
  // EDIT FARM
  // ============================================================

  const handleEditFarm = (
    farm: StoredFarm
  ) => {
    setEditingFarmId(
      farm.farmId
    );

    setLocation(
      farm.location || ''
    );

    setDistrict(
      farm.district || ''
    );

    setTotalAcres(
      farm.totalAcres || 5
    );

    setMainCrops(
      Array.isArray(
        farm.mainCrops
      )
        ? farm.mainCrops.join(', ')
        : ''
    );

    let savedSoil =
      farm.soilType ||
      'Loamy';

    if (
      savedSoil
        .toLowerCase()
        .includes('sandy loam')
    ) {
      savedSoil =
        'Sandy Loam';
    } else if (
      savedSoil
        .toLowerCase()
        .includes('clay loam')
    ) {
      savedSoil =
        'Clay Loam';
    } else if (
      savedSoil
        .toLowerCase()
        .includes('loamy')
    ) {
      savedSoil =
        'Loamy';
    } else if (
      savedSoil
        .toLowerCase()
        .includes('sandy')
    ) {
      savedSoil =
        'Sandy';
    } else if (
      savedSoil
        .toLowerCase()
        .includes('clay')
    ) {
      savedSoil =
        'Clay';
    } else if (
      savedSoil
        .toLowerCase()
        .includes('silty')
    ) {
      savedSoil =
        'Silty';
    }

    setSoilType(
      savedSoil
    );

    setWaterSource(
      farm.waterSource ||
        'Canal'
    );

    setIsEditing(true);
  };

  // ============================================================
  // SAVE / UPDATE
  // ============================================================

  const handleSave = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!user) return;

    const farmData:
      FarmData & {
        farmId?: string;
      } = {
      userId:
        user.userId,

      farmId:
        editingFarmId ||
        undefined,

      location:
        location.trim(),

      district:
        district.trim(),

      totalAcres:
        Number(totalAcres),

      mainCrops:
        mainCrops
          .split(',')
          .map(
            (item) =>
              item.trim()
          )
          .filter(Boolean),

      soilType,

      waterSource,

      updatedAt:
        new Date().toISOString()
    };

    const savedFarm =
      db.saveFarmData(
        farmData
      );

    setFarms(
      (previous) => {
        const index =
          previous.findIndex(
            (item) =>
              item.farmId ===
              savedFarm.farmId
          );

        if (index >= 0) {
          const updated =
            [...previous];

          updated[index] =
            savedFarm;

          return updated;
        }

        return [
          ...previous,
          savedFarm
        ];
      }
    );

    const wasEditing =
      !!editingFarmId;

    resetForm();

    setIsEditing(false);

    setSaveSuccess(true);

    setDeleteSuccess(false);

    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);

    // Prevent unused warning
    void wasEditing;
  };

  // ============================================================
  // DELETE FARM
  // ============================================================

  const handleDelete = () => {
    if (
      !user ||
      !farmToDelete
    ) {
      return;
    }

    db.deleteFarmDataById(
      user.userId,
      farmToDelete.farmId
    );

    setFarms(
      (previous) =>
        previous.filter(
          (farm) =>
            farm.farmId !==
            farmToDelete.farmId
        )
    );

    setFarmToDelete(null);

    setShowDeleteConfirm(
      false
    );

    setDeleteSuccess(true);

    setTimeout(() => {
      setDeleteSuccess(false);
    }, 3000);
  };

  // ============================================================
  // CANCEL
  // ============================================================

  const handleCancel = () => {
    resetForm();
    setIsEditing(false);
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

      {/* HEADER */}

      <div className="flex items-center justify-between pb-4 border-b border-[#DDE8DD]">

        <button
          type="button"
          onClick={() =>
            navigate(
              '/farmer/dashboard'
            )
          }
          className="flex items-center gap-1.5 text-sm font-bold text-[#5F6B63] hover:text-[#2E7D32]"
        >
          <ArrowLeft className="w-4 h-4" />

          <span>
            {currentText.back}
          </span>
        </button>

        <h1 className="w-full text-center text-xl sm:text-2xl font-extrabold text-[#1F2933]">
          🌾 {t.farmDetailsTitle}
        </h1>

      </div>

      {/* SUCCESS */}

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-[#E8F5E9] border border-[#4CAF50] text-[#2E7D32] font-bold text-sm flex items-center gap-2">
          <Check className="w-5 h-5" />

          <span>
            {editingFarmId
              ? currentText.farmUpdated
              : currentText.farmSaved}
          </span>
        </div>
      )}

      {deleteSuccess && (
        <div className="p-4 rounded-2xl bg-[#E8F5E9] border border-[#4CAF50] text-[#2E7D32] font-bold text-sm flex items-center gap-2">
          <Check className="w-5 h-5" />

          <span>
            {currentText.farmDeleted}
          </span>
        </div>
      )}

      {/* ======================================================
          ADD BUTTON
          ====================================================== */}

      {!isEditing && (
        <div className="flex justify-end">

          <button
            type="button"
            onClick={
              handleAddFarm
            }
            className="px-5 py-3 rounded-2xl bg-[#2E7D32] hover:bg-[#1b4d1f] text-white font-bold text-sm shadow-md flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />

            <span>
              {farms.length === 0
                ? currentText.addFarm
                : currentText.addAnotherFarm}
            </span>
          </button>

        </div>
      )}

      {/* ======================================================
          EMPTY STATE
          ====================================================== */}

      {farms.length === 0 &&
        !isEditing && (
          <div className="glass-card rounded-3xl p-12 text-center border border-[#DDE8DD] shadow-xl space-y-4">

            <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mx-auto">
              <Sprout className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-[#1F2933]">
              {currentText.noFarm}
            </h3>

            <p className="text-sm text-[#5F6B63] max-w-md mx-auto">
              {
                currentText.noFarmDescription
              }
            </p>

            <button
              type="button"
              onClick={
                handleAddFarm
              }
              className="px-8 py-3.5 rounded-2xl bg-[#2E7D32] hover:bg-[#1b4d1f] text-white font-bold shadow-md inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />

              {currentText.addFarm}
            </button>

          </div>
        )}

      {/* ======================================================
          ADD / EDIT FORM
          ====================================================== */}

      {isEditing && (
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-[#DDE8DD] shadow-xl bg-white">

          <div className="mb-6">

            <h2 className="text-xl font-extrabold text-[#1F2933]">
              {editingFarmId
                ? currentText.editFarm
                : currentText.addFarm}
            </h2>

          </div>

          <form
            onSubmit={handleSave}
            className="space-y-5"
          >

            {/* LOCATION + DISTRICT */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1.5">
                  {currentText.location}
                </label>

                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) =>
                    setLocation(
                      e.target.value
                    )
                  }
                  placeholder={
                    currentText.locationPlaceholder
                  }
                  className="w-full px-3.5 py-2.5 border border-[#DDE8DD] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1.5">
                  {currentText.district}
                </label>

                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) =>
                    setDistrict(
                      e.target.value
                    )
                  }
                  placeholder={
                    currentText.districtPlaceholder
                  }
                  className="w-full px-3.5 py-2.5 border border-[#DDE8DD] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>

            </div>

            {/* SIZE + WATER */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1.5">
                  {currentText.farmSize}
                </label>

                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  required
                  value={totalAcres}
                  onChange={(e) =>
                    setTotalAcres(
                      Number(
                        e.target.value
                      )
                    )
                  }
                  className="w-full px-3.5 py-2.5 border border-[#DDE8DD] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1.5">
                  {currentText.waterSource}
                </label>

                <select
                  value={waterSource}
                  onChange={(e) =>
                    setWaterSource(
                      e.target.value as FarmData['waterSource']
                    )
                  }
                  className="w-full px-3.5 py-2.5 border border-[#DDE8DD] rounded-xl text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                >
                  <option value="Canal">
                    {waterLabels.Canal}
                  </option>

                  <option value="Tube-well">
                    {
                      waterLabels[
                        'Tube-well'
                      ]
                    }
                  </option>

                  <option value="Solar Tube-well">
                    {
                      waterLabels[
                        'Solar Tube-well'
                      ]
                    }
                  </option>

                  <option value="Rainfed">
                    {waterLabels.Rainfed}
                  </option>

                  <option value="Mixed">
                    {waterLabels.Mixed}
                  </option>
                </select>
              </div>

            </div>

            {/* SOIL */}

            <div>
              <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1.5">
                {currentText.soilType}
              </label>

              <select
                value={soilType}
                onChange={(e) =>
                  setSoilType(
                    e.target.value
                  )
                }
                required
                className="w-full px-3.5 py-2.5 border border-[#DDE8DD] rounded-xl text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
              >
                <option
                  value=""
                  disabled
                >
                  {currentText.selectSoil}
                </option>

                <option value="Loamy">
                  {soilLabels.Loamy}
                </option>

                <option value="Sandy">
                  {soilLabels.Sandy}
                </option>

                <option value="Clay">
                  {soilLabels.Clay}
                </option>

                <option value="Silty">
                  {soilLabels.Silty}
                </option>

                <option value="Sandy Loam">
                  {
                    soilLabels[
                      'Sandy Loam'
                    ]
                  }
                </option>

                <option value="Clay Loam">
                  {
                    soilLabels[
                      'Clay Loam'
                    ]
                  }
                </option>
              </select>
            </div>

            {/* CROPS */}

            <div>
              <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1.5">
                {currentText.mainCrops}{' '}
                <span className="normal-case font-medium text-[#5F6B63]">
                  {
                    currentText.commaSeparated
                  }
                </span>
              </label>

              <input
                type="text"
                required
                value={mainCrops}
                onChange={(e) =>
                  setMainCrops(
                    e.target.value
                  )
                }
                placeholder={
                  currentText.cropsPlaceholder
                }
                className="w-full px-3.5 py-2.5 border border-[#DDE8DD] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
              />
            </div>

            {/* BUTTONS */}

            <div className="flex gap-3 pt-4 border-t border-[#DDE8DD]">

              <button
                type="button"
                onClick={
                  handleCancel
                }
                className="px-6 py-2.5 rounded-xl border border-[#DDE8DD] text-sm font-semibold text-[#5F6B63] hover:bg-[#F8FAF7]"
              >
                {currentText.cancel}
              </button>

              <button
                type="submit"
                className="px-8 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1b4d1f] text-white font-bold text-sm shadow-md flex items-center gap-2"
              >
                <Save className="w-4 h-4" />

                {editingFarmId
                  ? currentText.update
                  : currentText.save}
              </button>

            </div>

          </form>
        </div>
      )}

      {/* ======================================================
          FARM CARDS
          ====================================================== */}

      {!isEditing &&
        farms.map((farm, index) => (
          <div
            key={farm.farmId}
            className="glass-card rounded-3xl p-6 sm:p-8 border border-[#DDE8DD] shadow-xl bg-white space-y-6"
          >

            {/* CARD HEADER */}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#DDE8DD]">

              <div>

                <span className="text-xs font-bold uppercase text-[#2E7D32]">
                  {currentText.registeredFarm}{' '}
                  {index + 1}
                </span>

                <h2 className="text-2xl font-extrabold text-[#1F2933] mt-1">
                  {farm.location}
                </h2>

                <p className="text-xs text-[#5F6B63]">
                  {currentText.district}{' '}
                  {farm.district}
                </p>

              </div>

              <div className="flex items-center gap-2">

                {/* EDIT */}

                <button
                  type="button"
                  onClick={() =>
                    handleEditFarm(
                      farm
                    )
                  }
                  className="px-4 py-2 rounded-xl bg-[#E8F5E9] hover:bg-[#DDE8DD] text-[#2E7D32] text-sm font-bold flex items-center gap-1.5"
                >
                  <Edit3 className="w-4 h-4" />

                  {currentText.edit}
                </button>

                {/* DELETE */}

                <button
                  type="button"
                  onClick={() => {
                    setFarmToDelete(
                      farm
                    );

                    setShowDeleteConfirm(
                      true
                    );
                  }}
                  className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-sm font-bold flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />

                  {currentText.delete}
                </button>

              </div>

            </div>

            {/* FARM INFO */}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              {/* SIZE */}

              <div className="bg-[#F8FAF7] p-4 rounded-2xl border border-[#DDE8DD]">

                <div className="flex items-center gap-2 mb-2">
                  <Ruler className="w-4 h-4 text-[#2E7D32]" />

                  <span className="text-xs text-[#5F6B63]">
                    {currentText.farmSize}
                  </span>
                </div>

                <p className="text-xl font-extrabold text-[#2E7D32]">
                  {farm.totalAcres}{' '}
                  {currentText.acres}
                </p>

              </div>

              {/* WATER */}

              <div className="bg-[#F8FAF7] p-4 rounded-2xl border border-[#DDE8DD]">

                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="w-4 h-4 text-[#2E7D32]" />

                  <span className="text-xs text-[#5F6B63]">
                    {currentText.waterSource}
                  </span>
                </div>

                <p className="text-base font-bold text-[#1F2933]">
                  {
                    waterLabels[
                      farm.waterSource
                    ] ||
                      farm.waterSource
                  }
                </p>

              </div>

              {/* SOIL */}

              <div className="bg-[#F8FAF7] p-4 rounded-2xl border border-[#DDE8DD]">

                <div className="flex items-center gap-2 mb-2">
                  <Layers className="w-4 h-4 text-[#2E7D32]" />

                  <span className="text-xs text-[#5F6B63]">
                    {currentText.soilType}
                  </span>
                </div>

                <p className="text-base font-bold text-[#1F2933]">
                  {
                    soilLabels[
                      farm.soilType as keyof typeof soilLabels
                    ] ||
                      farm.soilType
                  }
                </p>

              </div>

            </div>

            {/* CROPS */}

            <div className="space-y-2">

              <span className="text-xs font-bold text-[#5F6B63] uppercase tracking-wider">
                {currentText.mainCrops}:
              </span>

              <div className="flex flex-wrap gap-2">

                {farm.mainCrops.map(
                  (
                    crop,
                    cropIndex
                  ) => (
                    <span
                      key={
                        cropIndex
                      }
                      className="px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-bold"
                    >
                      🌾 {crop}
                    </span>
                  )
                )}

              </div>

            </div>

          </div>
        ))}

      {/* ======================================================
          DELETE CONFIRMATION
          ====================================================== */}

      {showDeleteConfirm &&
        farmToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">

            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() =>
                setShowDeleteConfirm(
                  false
                )
              }
            />

            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#DDE8DD] p-6 sm:p-8">

              <button
                type="button"
                onClick={() =>
                  setShowDeleteConfirm(
                    false
                  )
                }
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#F8FAF7] hover:bg-[#E8F5E9] text-[#5F6B63] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-5">
                <Trash2 className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-extrabold text-[#1F2933] mb-2">
                {currentText.deleteTitle}
              </h3>

              <p className="text-sm text-[#5F6B63] leading-6 mb-7">
                {currentText.deleteMessage}
              </p>

              <div className="flex gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setShowDeleteConfirm(
                      false
                    )
                  }
                  className="flex-1 px-5 py-3 rounded-xl border border-[#DDE8DD] text-[#5F6B63] font-bold text-sm hover:bg-[#F8FAF7]"
                >
                  {currentText.cancel}
                </button>

                <button
                  type="button"
                  onClick={
                    handleDelete
                  }
                  className="flex-1 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />

                  {currentText.confirmDelete}
                </button>

              </div>

            </div>

          </div>
        )}

    </div>
  );
};