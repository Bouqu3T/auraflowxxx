'use client';
import React, { useState } from 'react';
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

interface ShichenOption {
  value: string;
  label: string;
  time: string;
}

interface EditProfileFormProps {
  profile: Profile;
  shichenOptions: ShichenOption[];
}

const EditProfileForm = ({ profile, shichenOptions }: EditProfileFormProps) => {
  const router = useRouter();

  const [formData, setFormData] = useState<Profile>(profile);
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      localStorage.setItem('auraflow_profiles', JSON.stringify([
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
      ]));

      alert('档案保存成功！');
      setIsLoading(false);
      router.push('/profile');
    }, 500);
  };

  return (
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
          {shichenOptions.map((option) => (
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

      <div className="flex justify-end space-x-4 pt-4">
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
  );
};

export default EditProfileForm;
