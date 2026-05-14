'use client';

import React, { useState, useEffect } from 'react';
import { Modal, Input, Radio, DatePicker, Button, Toast } from 'antd-mobile';

interface Profile {
  id: string;
  name: string;
  birthDate: string;
  gender: string;
  location: string;
  isDefault: boolean;
  bazi: any;
  matchedCrystals: any[];
}

interface EditProfileModalProps {
  visible: boolean;
  profile: Profile | null;
  onClose: () => void;
  onSave: (profile: Profile) => void;
  isLoading: boolean;
}

export default function EditProfileModal({ visible, profile, onClose, onSave, isLoading }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    birthDate: new Date(),
    gender: '女',
    location: '',
  });

  // 当profile变化时，更新表单数据
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        birthDate: profile.birthDate ? new Date(profile.birthDate) : new Date(),
        gender: profile.gender || '女',
        location: profile.location || '',
      });
    }
  }, [profile]);

  const handleSave = () => {
    // 表单验证
    if (!formData.name || formData.name.trim() === '') {
      Toast.show('请输入档案名称');
      return;
    }

    if (!profile) return;

    // 构建更新后的档案数据
    const updatedProfile: Profile = {
      ...profile,
      name: formData.name.trim(),
      birthDate: formData.birthDate.toISOString().split('T')[0],
      gender: formData.gender,
      location: formData.location.trim(),
    };

    onSave(updatedProfile);
  };

  return (
    <Modal
      title="编辑档案"
      visible={visible}
      onClose={onClose}
      content={
        <div className="space-y-5 p-5">
          {/* 档案名称 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">档案名称 *</label>
            <Input
              placeholder="如：自己、妈妈"
              value={formData.name}
              onChange={(value) => setFormData({ ...formData, name: value })}
              className="w-full p-3 border border-gray-200 rounded-lg"
            />
          </div>
          
          {/* 性别选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">性别</label>
            <div className="w-full flex gap-6">
              <Radio.Group
                value={formData.gender}
                onChange={(value) => setFormData({ ...formData, gender: String(value) })}
              >
                <Radio value="女">女</Radio>
                <Radio value="男">男</Radio>
              </Radio.Group>
            </div>
          </div>
          
          {/* 出生日期 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">出生日期</label>
            <DatePicker
              title="选择出生日期"
              value={formData.birthDate}
              onConfirm={(date) => setFormData({ ...formData, birthDate: date })}
            >
              {() => (
                <div className="w-full p-3 border border-gray-200 rounded-lg bg-white text-gray-700 cursor-pointer">
                  {formData.birthDate.toISOString().split('T')[0]}
                </div>
              )}
            </DatePicker>
          </div>
          
          {/* 出生地 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">出生地</label>
            <Input
              placeholder="如：北京市朝阳区"
              value={formData.location}
              onChange={(value) => setFormData({ ...formData, location: value })}
              className="w-full p-3 border border-gray-200 rounded-lg"
            />
          </div>
          
          {/* 按钮 */}
          <div className="flex space-x-4 mt-8">
            <Button 
              className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg"
              onClick={onClose}
              disabled={isLoading}
            >
              取消
            </Button>
            <Button 
              className="flex-1 py-2 bg-gradient-to-r from-[#FFB6C1] to-[#D8BFD8] text-white rounded-lg"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? '保存中...' : '保存'}
            </Button>
          </div>
        </div>
      }
    />
  );
}
