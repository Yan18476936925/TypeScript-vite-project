export default function infoFil(info) {
  let value;
  switch (info.fields) {
    case 'sex':
      if (info.value == 1) value = '男';
      if (info.value == 2) value = '女';
      break;
    case 'birthday_type':
      if (info.value == 1) value = '阴历';
      if (info.value == 2) value = '阳历';
      break;
    case 'education':
      if (info.value == 1) value = '大专';
      if (info.value == 2) value = '本科';
      if (info.value == 3) value = '硕士';
      if (info.value == 4) value = '博士';
      break;
    default:
      value = info.value;
  }
  return value;
}
