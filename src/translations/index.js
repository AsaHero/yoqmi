// src/translations/index.js
export const translations = {
    en: {
        common: {
            loading: 'Loading...',
            error: 'An error occurred',
            retry: 'Retry',
            save: 'Save',
            cancel: 'Cancel',
            delete: 'Delete',
            edit: 'Edit',
            confirm: 'Confirm',
            success: 'Success',
            or: 'or',
            back: "<- Back"
        },

        // Authentication
        auth: {
            welcomeBack: 'Welcome Back',
            loginToContinue: 'Log in to your account to continue',
            login: 'Log In',
            signup: 'Sign Up',
            createAccount: 'Create Account',
            joinFamily: 'Join Family',
            email: 'Email',
            password: 'Password',
            name: 'Name',
            familyName: 'Family Name',
            rememberMe: 'Remember me',
            forgotPassword: 'Forgot password?',
            noAccount: `Don't have an account?`,
            alreadyHaveAccount: 'Already have an account?',
            createFamilyDesc: 'Create a new family account to start managing your shopping lists',
            joiningFamily: 'Joining {name} family',
            loginError: 'Invalid email or password',
            signupSuccess: 'Account created successfully',
            joinSuccess: 'Joined family successfully',
            invalidInvite: 'Invalid or expired invite code',
            addAvatar: 'Add avatar',
            changeAvatar: 'Change avatar',
            logout: 'Log out',
            wantNewFamily: 'Want to create your own family?',
            createNew: 'Create new',
        },

        // Navigation & Common
        navigation: {
            home: 'Home',
            settings: 'Settings',
            familyMembers: 'Family Members',
            signOut: 'Sign Out',
        },

        // User Profile
        profile: {
            title: 'Profile',
            profilePicture: 'Profile Picture',
            changePhoto: 'Change Photo',
            name: 'Name',
            email: 'Email',
            saveChanges: 'Save Changes',
            updating: 'Updating...',
            changePictureButton: 'Change',
        },

        // Settings
        settings: {
            title: 'Settings',
            preferences: 'Preferences',
            language: 'Language',
            theme: 'Theme',
            darkMode: 'Dark Mode',
            profile: 'Profile',
        },

        // Shopping List
        shopping: {
            title: 'Shopping List',
            addItem: 'Add Item',
            editItem: 'Edit Item',
            deleteItem: 'Delete Item',
            noItems: 'Your shopping list is empty',
            addFirstItem: 'Click the "Add Item" button to get started!',
            itemCount: '{count} items',
            itemsCompleted: '{count} completed',
        },

        // Item Form
        itemForm: {
            itemName: 'Item Name',
            quantity: 'Quantity',
            priority: 'Priority',
            notes: 'Notes (optional)',
            cancel: 'Cancel',
            add: 'Add Item',
            save: 'Save Changes',
            delete: 'Delete',
            priorities: {
                low: 'Low',
                medium: 'Medium',
                high: 'High',
            },
            units: {
                pieces: 'pieces',
                kg: 'kg',
                g: 'g',
                l: 'l',
                ml: 'ml',
            },
        },

        // Messages
        messages: {
            saved: 'Changes saved successfully',
            error: 'An error occurred',
            confirmDelete: 'Are you sure you want to delete this item?',
            offline: 'You are offline',
            online: 'Connected',
            syncing: 'Syncing changes...',
        },

        // Validation
        validation: {
            required: 'This field is required',
            invalidEmail: 'Please enter a valid email address',
            passwordMin: 'Password must be at least 8 characters',
            passwordRequirements: 'Password must contain at least 8 characters, one uppercase letter, one number',
            minValue: 'Must be at least {{min}}',
            maxValue: 'Must not exceed {{max}}',
        },
        family: {
            title: 'Family Members',
            memberCount: '{count} members',
            invite: 'Invite Member',
            qrCodeTitle: 'Invite QR Code',
            qrCodeDescription: 'Share this QR code with family members to join your shopping list',
            copyLink: 'Copy Invite Link',
            copied: 'Invite link copied to clipboard',
            removeMember: 'Remove member',
            confirmRemove: 'Are you sure you want to remove this member?',
            membersList: "Members List",
            inviteDescription: "Invite link",
            refreshLink: "Refresh Link",
            downloadQR: "Download QR Code",
            generateInvite: "Generate invite",
            inviteExpires: "Invite expires",
            roles: {
                moderator: 'Creator',
                admin: 'Administrator',
                member: 'Member'
            }
        },
    },

    ru: {
        common: {
            loading: 'Загрузка...',
            error: 'Произошла ошибка',
            retry: 'Повторить',
            save: 'Сохранить',
            cancel: 'Отмена',
            delete: 'Удалить',
            edit: 'Изменить',
            confirm: 'Подтвердить',
            success: 'Успешно',
            or: 'или',
            back: "<- Назад"
        },

        // Authentication
        auth: {
            welcomeBack: 'С возвращением',
            loginToContinue: 'Войдите в свой аккаунт, чтобы продолжить',
            login: 'Войти',
            signup: 'Регистрация',
            createAccount: 'Создать аккаунт',
            joinFamily: 'Присоединиться к семье',
            email: 'Эл. почта',
            password: 'Пароль',
            name: 'Имя',
            familyName: 'Название семьи',
            rememberMe: 'Запомнить меня',
            forgotPassword: 'Забыли пароль?',
            noAccount: 'Нет аккаунта?',
            alreadyHaveAccount: 'Уже есть аккаунт?',
            createFamilyDesc: 'Создайте новый семейный аккаунт для управления списками покупок',
            joiningFamily: 'Присоединение к семье {name}',
            loginError: 'Неверный email или пароль',
            signupSuccess: 'Аккаунт успешно создан',
            joinSuccess: 'Успешное присоединение к семье',
            invalidInvite: 'Недействительный или просроченный код приглашения',
            addAvatar: 'Добавить аватар',
            changeAvatar: 'Изменить аватар',
            logout: 'Выйти',
            wantNewFamily: 'Хотите создать свою семью?',
            createNew: 'Создать новую',
        },

        // Navigation & Common
        navigation: {
            home: 'Главная',
            settings: 'Настройки',
            familyMembers: 'Члены семьи',
            signOut: 'Выйти',
        },

        // User Profile
        profile: {
            title: 'Профиль',
            profilePicture: 'Фото профиля',
            changePhoto: 'Изменить фото',
            name: 'Имя',
            email: 'Эл. почта',
            saveChanges: 'Сохранить изменения',
            updating: 'Обновление...',
            changePictureButton: 'Изменить',
        },

        // Settings
        settings: {
            title: 'Настройки',
            preferences: 'Предпочтения',
            language: 'Язык',
            theme: 'Тема',
            darkMode: 'Тёмная тема',
            profile: 'Профиль',
        },

        // Shopping List
        shopping: {
            title: 'Список покупок',
            addItem: 'Добавить',
            editItem: 'Изменить',
            deleteItem: 'Удалить',
            noItems: 'Ваш список покупок пуст',
            addFirstItem: 'Нажмите кнопку "Добавить" чтобы начать!',
            itemCount: '{count} товаров',
            itemsCompleted: '{count} выполнено',
        },

        // Item Form
        itemForm: {
            itemName: 'Название товара',
            quantity: 'Количество',
            priority: 'Приоритет',
            notes: 'Заметки (необязательно)',
            cancel: 'Отмена',
            add: 'Добавить',
            save: 'Сохранить',
            delete: 'Удалить',
            priorities: {
                low: 'Низкий',
                medium: 'Средний',
                high: 'Высокий',
            },
            units: {
                pieces: 'шт',
                kg: 'кг',
                g: 'г',
                l: 'л',
                ml: 'мл',
            },
        },

        // Messages
        messages: {
            saved: 'Изменения сохранены',
            error: 'Произошла ошибка',
            confirmDelete: 'Вы уверены, что хотите удалить этот товар?',
            offline: 'Нет подключения',
            online: 'Подключено',
            syncing: 'Синхронизация...',
        },

        // Validation
        validation: {
            required: "Это поле обязательно для заполнения",
            invalidEmail: "Пожалуйста, введите действительный адрес электронной почты",
            passwordMin: "Пароль должен содержать не менее 8 символов",
            passwordRequirements: "Пароль должен содержать не менее 8 символов, одну заглавную букву, одну цифру",
            minValue: "Должно быть не менее {{min}}",
            maxValue: "Не должно превышать {{max}}"
        },
        family: {
            title: 'Члены семьи',
            memberCount: '{count} участников',
            invite: 'Пригласить участника',
            qrCodeTitle: 'QR-код приглашения',
            qrCodeDescription: 'Поделитесь этим QR-кодом с членами семьи для присоединения к списку покупок',
            copyLink: 'Копировать ссылку',
            copied: 'Ссылка-приглашение скопирована',
            removeMember: 'Удалить участника',
            confirmRemove: 'Вы уверены, что хотите удалить этого участника?',
            membersList: 'Список участников',
            inviteDescription: 'Ссылка для приглашение',
            refreshLink: 'Обновить ссылку',
            downloadQR: 'Скачать QR-код',
            generateInvite: "Создать приглашение",
            inviteExpires: "Срок действия приглашения истекает",
            roles: {
                moderator: 'Создатель',
                admin: 'Администратор',
                member: 'Участник'
            }
        },
    },

    uz: {
        common: {
            loading: 'Yuklanmoqda...',
            error: 'Xatolik yuz berdi',
            retry: 'Qayta urinish',
            save: 'Saqlash',
            cancel: 'Bekor qilish',
            delete: `O'chirish`,
            edit: `O'zgartirish`,
            confirm: 'Tasdiqlash',
            success: 'Muvaffaqiyatli',
            or: 'yoki',
            back: "<- Orkaga"
        },

        // Authentication
        auth: {
            welcomeBack: 'Xush kelibsiz',
            loginToContinue: 'Davom etish uchun hisobingizga kiring',
            login: 'Kirish',
            signup: `Ro'yxatdan o'tish`,
            createAccount: 'Hisob yaratish',
            joinFamily: `Oilaga qo'shilish`,
            email: 'Email',
            password: 'Parol',
            name: 'Ism',
            familyName: 'Oila nomi',
            rememberMe: 'Meni eslab qol',
            forgotPassword: 'Parolni unutdingizmi?',
            noAccount: `Hisobingiz yo'qmi?`,
            alreadyHaveAccount: 'Hisobingiz bormi?',
            createFamilyDesc: `Xarid ro'yxatlarini boshqarish uchun yangi oilaviy hisob yarating`,
            joiningFamily: `{name} oilasiga qo'shilish`,
            loginError: `Noto'g'ri email yoki parol`,
            signupSuccess: `Hisob muvaffaqiyatli yaratildi`,
            joinSuccess: `Oilaga muvaffaqiyatli qo'shildingiz`,
            invalidInvite: `Yaroqsiz yoki muddati o'tgan taklif kodi`,
            addAvatar: `Rasm qo'shish`,
            changeAvatar: `Rasmni o'zgartirish`,
            logout: `Chiqish`,
            wantNewFamily: `O'z oilangizni yaratmoqchimisiz?`,
            createNew: 'Yangi yaratish',
        },
        // Navigation & Common
        navigation: {
            home: 'Asosiy',
            settings: 'Sozlamalar',
            familyMembers: 'Oila a\'zolari',
            signOut: 'Chiqish',
        },

        // User Profile
        profile: {
            title: 'Profil',
            profilePicture: 'Profil rasmi',
            changePhoto: 'Rasmni o\'zgartirish',
            name: 'Ism',
            email: 'Email',
            saveChanges: 'O\'zgarishlarni saqlash',
            updating: 'Yangilanmoqda...',
            changePictureButton: 'O\'zgartirish',
        },

        // Settings
        settings: {
            title: 'Sozlamalar',
            preferences: 'Afzalliklar',
            language: 'Til',
            theme: 'Mavzu',
            darkMode: 'Tungi rejim',
            profile: 'Profil',
        },

        // Shopping List
        shopping: {
            title: 'Xarid ro\'yxati',
            addItem: 'Qo\'shish',
            editItem: 'O\'zgartirish',
            deleteItem: 'O\'chirish',
            noItems: 'Sizning xarid ro\'yxatingiz bo\'sh',
            addFirstItem: 'Boshlash uchun "Qo\'shish" tugmasini bosing!',
            itemCount: '{count} ta mahsulot',
            itemsCompleted: '{count} ta bajarildi',
        },

        // Item Form
        itemForm: {
            itemName: 'Mahsulot nomi',
            quantity: 'Miqdori',
            priority: 'Muhimligi',
            notes: 'Izohlar (ixtiyoriy)',
            cancel: 'Bekor qilish',
            add: 'Qo\'shish',
            save: 'Saqlash',
            delete: 'O\'chirish',
            priorities: {
                low: 'Past',
                medium: 'O\'rta',
                high: 'Yuqori',
            },
            units: {
                pieces: 'dona',
                kg: 'kg',
                g: 'g',
                l: 'l',
                ml: 'ml',
            },
        },

        // Messages
        messages: {
            saved: 'O\'zgarishlar saqlandi',
            error: 'Xatolik yuz berdi',
            confirmDelete: 'Ushbu mahsulotni o\'chirishni xohlaysizmi?',
            offline: 'Internet aloqasi yo\'q',
            online: 'Ulangan',
            syncing: 'Sinxronlanmoqda...',
        },

        // Validation
        validation: {
            required: 'Bu maydon to\'ldirilishi shart',
            invalidEmail: 'To\'g\'ri email manzilini kiriting',
            passwordMin: "Parol kamida 8 ta belgidan iborat bo‘lishi kerak",
            passwordRequirements: "Parol kamida 8 ta belgi, bitta katta harf va bitta raqamdan iborat bo‘lishi kerak",
            minValue: "Kamida {{min}} bo‘lishi kerak",
            maxValue: "{{max}} dan oshmasligi kerak"
        },
        family: {
            title: 'Oila a\'zolari',
            memberCount: '{count} ta a\'zo',
            invite: 'A\'zo qo\'shish',
            qrCodeTitle: 'Taklif QR kodi',
            qrCodeDescription: 'Xarid ro\'yxatiga qo\'shilish uchun ushbu QR kodni oila a\'zolari bilan ulashing',
            copyLink: 'Havolani nusxalash',
            copied: 'Taklif havolasi nusxalandi',
            removeMember: 'A\'zoni o\'chirish',
            confirmRemove: 'Ushbu a\'zoni o\'chirishni xohlaysizmi?',
            membersList: 'A`zolar ro`yxati',
            inviteDescription: 'Taklif havolsi',
            refreshLink: 'Havolani yangilash',
            downloadQR: 'QR kodni yuklab olish',
            generateInvite: "Taklif yaratish",
            inviteExpires: "Taklif muddati tugaydi",
            roles: {
                moderator: 'Muallif',
                admin: 'Administrator',
                member: 'A\'zo'
            }
        },
    },
};