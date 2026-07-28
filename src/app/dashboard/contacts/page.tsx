'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { contactsAPI, Contact } from '@/lib/api';
import { Search, Trash2, Mail, User, MessageSquare, Calendar } from 'lucide-react';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const data = await contactsAPI.getAll();
      setContacts(data);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    try {
      await contactsAPI.delete(id);
      setContacts(contacts.filter((contact) => contact.id !== id));
    } catch (error) {
      console.error('Failed to delete contact:', error);
      alert('Failed to delete contact');
    }
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="text-sm text-gray-500">{filteredContacts.length} messages</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading contacts...</p>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="p-8 text-center">
              <Mail className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No contacts found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredContacts.map((contact) => (
                <div key={contact.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <User className="h-5 w-5 text-gray-400" />
                        <span className="font-semibold text-gray-900">{contact.name}</span>
                        <a href={`mailto:${contact.email}`} className="text-indigo-600 hover:underline flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {contact.email}
                        </a>
                      </div>
                      <div className="flex items-start gap-3">
                        <MessageSquare className="h-5 w-5 text-gray-400 mt-0.5" />
                        <p className="text-gray-600">{contact.message}</p>
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
                        <Calendar className="h-4 w-4" />
                        {new Date(contact.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(contact.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
