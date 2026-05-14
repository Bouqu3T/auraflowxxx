'use client';
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useRouter } from 'next/navigation';

interface Profile {
  id: string;
  name: string;
  birth_date: string;
  birth_time: string;
  gender: string;
  location: string;
  is_default: boolean;
}

const SHICHEN_OPTIONS = [
  { value: '子时', label: '子时', time: '23:00-00:59' },
  { value: '丑时', label: '丑时', time: '01:00-02:59' },
  { value: '寅时', label: '寅时', time: '03:00-04:59' },
  { value: '卯时', label: '卯时', time: '05:00-06:59' },
  { value: '辰时', label: '辰时', time: '07:00-08:59' },
  { value: '巳时', label: '巳时', time: '09:00-10:59' },
  { value: '午时', label: '午时', time: '11:00-12:59' },
  { value: '未时', label: '未时', time: '13:00-14:59' },
  { value: '申时', label: '申时', time: '15:00-16:59' },
  { value: '酉时', label: '酉时', time: '17:00-18:59' },
  { value: '戌时', label: '戌时', time: '19:00-20:59' },
  { value: '亥时', label: '亥时', time: '21:00-22:59' }
];

const NewProfilePage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    birth_date: '',
    birth_time: '',
    gender: '女',
    location: '',
    is_default: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const storedProfiles = localStorage.getItem('auraflow_profiles');
      const profiles = storedProfiles ? JSON.parse(storedProfiles) : [
        {
          id: '1',
          name: '自己',
          birth_date: '1998-08-18',
          birth_time: '辰时',
          gender: '女',
          location: '杭州西湖区',
          is_default: true
        },
        {
          id: '2',
          name: '妈妈',
          birth_date: '1972-03-12',
          birth_time: '丑时',
          gender: '女',
          location: '温州鹿城区',
          is_default: false
        }
      ];

      const newId = String(profiles.length + 1);

      const newProfile: Profile = {
        id: newId,
        ...formData
      };

      const updatedProfiles = profiles.map((profile: Profile) => ({
        ...profile,
        is_default: formData.is_default ? false : profile.is_default
      }));

      updatedProfiles.push(newProfile);

      localStorage.setItem('auraflow_profiles', JSON.stringify(updatedProfiles));

      alert('档案创建成功！');
      setIsLoading(false);
      router.push('/profile');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-4">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="mr-4 text-[#777777]"
        >
          ←
        </button>
        <h1 className="text-xl font-medium text-[#333333]">创建档案</h1>
      </div>

      <Card className="p-6 bg-white rounded-2xl border border-[#E6DED0]">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="name" className="text-[#333333] font-medium">档案名称</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="如：自己、妈妈"
              className="mt-1.5 border-[#E6DED0] focus:border-[#D4C4A8] rounded-xl h-12"
            />
          </div>

          <div>
            <Label htmlFor="birth_date" className="text-[#333333] font-medium">出生年月日</Label>
            <Input
              id="birth_date"
              name="birth_date"
              type="date"
              value={formData.birth_date}
              onChange={handleChange}
              className="mt-1.5 border-[#E6DED0] focus:border-[#D4C4A8] rounded-xl h-12"
            />
          </div>

          <div>
            <Label htmlFor="birth_time" className="text-[#333333] font-medium">出生时辰</Label>
            <p className="text-[#999999] text-xs mt-1 mb-2">精确的出生时辰有助于八字分析</p>
            <select
              id="birth_time"
              name="birth_time"
              value={formData.birth_time}
              onChange={handleChange}
              className="w-full h-12 px-4 border border-[#E6DED0] rounded-xl bg-white text-[#333333] focus:border-[#D4C4A8] focus:outline-none appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23777777' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 16px center'
              }}
            >
              <option value="">请选择出生时辰</option>
              {SHICHEN_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} ({option.time})
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label className="text-[#333333] font-medium">性别</Label>
            <div className="flex space-x-6 mt-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="male"
                  name="gender"
                  value="男"
                  checked={formData.gender === '男'}
                  onChange={handleChange}
                  className="w-5 h-5 accent-[#D4C4A8]"
                />
                <Label htmlFor="male" className="ml-2 text-[#333333]">男</Label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="female"
                  name="gender"
                  value="女"
                  checked={formData.gender === '女'}
                  onChange={handleChange}
                  className="w-5 h-5 accent-[#D4C4A8]"
                />
                <Label htmlFor="female" className="ml-2 text-[#333333]">女</Label>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="location" className="text-[#333333] font-medium">出生地 / 现居地</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="精确到区县，如：杭州西湖区"
              className="mt-1.5 border-[#E6DED0] focus:border-[#D4C4A8] rounded-xl h-12"
            />
          </div>

          <div className="flex items-center pt-2">
            <Checkbox
              id="is_default"
              name="is_default"
              checked={formData.is_default}
              onCheckedChange={(checked) => setFormData({ ...formData, is_default: checked === true })}
            />
            <Label htmlFor="is_default" className="ml-2 text-[#777777]">设为默认档案</Label>
          </div>

          <div className="flex justify-end space-x-4 mt-8">
            <Button
              type="button"
              onClick={() => router.back()}
              className="bg-white border border-[#DDD3C2] text-[#333333] rounded-xl h-11 px-6 hover:bg-[#FAF8F5]"
            >
              取消
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#D4C4A8] hover:bg-[#C9B897] text-[#333333] rounded-xl h-11 px-6 disabled:opacity-50"
            >
              {isLoading ? '保存中...' : '保存档案'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default NewProfilePage;
