import { db } from './firebase-config.js';
import {
    collection,
    doc,
    getDocs,
    getDoc,
    setDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ============== INITIATIVES ==============
export async function fetchInitiatives() {
    const snapshot = await getDocs(collection(db, 'initiatives'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function saveInitiative(data, id = null) {
    if (id) {
        await updateDoc(doc(db, 'initiatives', id), data);
    } else {
        await addDoc(collection(db, 'initiatives'), data);
    }
}

export async function deleteInitiative(id) {
    await deleteDoc(doc(db, 'initiatives', id));
}

// ============== NEWS ==============
export async function fetchNews() {
    const snapshot = await getDocs(collection(db, 'news'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function saveNews(data, id = null) {
    if (id) {
        await updateDoc(doc(db, 'news', id), data);
    } else {
        await addDoc(collection(db, 'news'), data);
    }
}

export async function deleteNews(id) {
    await deleteDoc(doc(db, 'news', id));
}

// ============== CALENDAR ==============
export async function fetchCalendar() {
    const snapshot = await getDocs(collection(db, 'calendar'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function saveCalendarEvent(data) {
    await addDoc(collection(db, 'calendar'), data);
}

export async function deleteCalendarEvent(id) {
    await deleteDoc(doc(db, 'calendar', id));
}

// ============== LINKS ==============
export async function fetchLinks() {
    const snapshot = await getDocs(collection(db, 'links'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function saveLink(data, id = null) {
    if (id) {
        await updateDoc(doc(db, 'links', id), data);
    } else {
        await addDoc(collection(db, 'links'), data);
    }
}

export async function deleteLink(id) {
    await deleteDoc(doc(db, 'links', id));
}

// ============== SETTINGS ==============
export async function fetchSettings() {
    const docRef = doc(db, 'settings', 'general');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        // Return default settings if not exists
        return {
            stats: { students: 450, teachers: 35, classes: 18, achievements: 25 },
            principal: { name: "رامي ارفاعية", image: "", message: "" },
            contact: {
                phone: "04-6313931",
                fax: "04-6110614",
                email: "Musherfeschool@gmail.com",
                whatsapp: "972502299119",
                facebook: "https://www.facebook.com/profile.php?id=100057560914853",
                youtube: "https://www.youtube.com/channel/UCiNs8tO_tmCsFfHbt_zroLw"
            }
        };
    }
}

export async function saveSettings(data) {
    await setDoc(doc(db, 'settings', 'general'), data);
}

// ============== MONTH VALUES ==============
export async function fetchMonthValues() {
    const docRef = doc(db, 'settings', 'monthValues');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    }
    return {};
}

export async function saveMonthValues(monthIndex, values) {
    const docRef = doc(db, 'settings', 'monthValues');
    const currentData = (await getDoc(docRef)).data() || {};
    currentData[monthIndex] = values;
    await setDoc(docRef, currentData);
}
