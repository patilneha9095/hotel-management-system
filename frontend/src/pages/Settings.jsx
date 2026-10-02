import { useEffect, useState } from "react";
import axios from "axios";

function Settings() {
  const [form, setForm] = useState({
    hotelName: "",
    hotelEmail: "",
    hotelPhone: "",
    hotelAddress: "",
    checkInTime: "",
    checkOutTime: "",
    cancellationPolicy: "",
    currency: "INR",
    taxPercentage: 0,
    enableOnlinePayment: true,
    enableEmailNotifications: true,
    enableBookingNotifications: true,
    enablePaymentNotifications: true,
  });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5050/api/settings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setForm(response.data.settings);
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to load settings"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } =
      e.target;

    setForm({
      ...form,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    });
  };

  const saveSettings = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const token =
        localStorage.getItem("token");

      const response = await axios.put(
        "http://localhost:5050/api/settings",
        {
          ...form,
          taxPercentage: Number(
            form.taxPercentage
          ),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setForm(response.data.settings);

      alert(
        "Settings updated successfully"
      );
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to update settings"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <h1>Loading settings...</h1>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Hotel Settings</h1>

          <p>
            Manage hotel information and
            system preferences.
          </p>
        </div>
      </div>

      <form
        className="settings-form"
        onSubmit={saveSettings}
      >
        {/* Hotel Information */}

        <section className="settings-section">
          <h2>Hotel Information</h2>

          <div className="settings-grid">
            <div className="form-group">
              <label>
                Hotel Name
              </label>

              <input
                type="text"
                name="hotelName"
                value={form.hotelName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>
                Hotel Email
              </label>

              <input
                type="email"
                name="hotelEmail"
                value={form.hotelEmail}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>
                Hotel Phone
              </label>

              <input
                type="text"
                name="hotelPhone"
                value={form.hotelPhone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>
                Currency
              </label>

              <select
                name="currency"
                value={form.currency}
                onChange={handleChange}
              >
                <option value="INR">
                  INR
                </option>

                <option value="USD">
                  USD
                </option>

                <option value="EUR">
                  EUR
                </option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>
              Hotel Address
            </label>

            <textarea
              name="hotelAddress"
              value={form.hotelAddress}
              onChange={handleChange}
              rows="3"
            />
          </div>
        </section>

        {/* Booking Settings */}

        <section className="settings-section">
          <h2>Booking Settings</h2>

          <div className="settings-grid">
            <div className="form-group">
              <label>
                Check-in Time
              </label>

              <input
                type="time"
                name="checkInTime"
                value={form.checkInTime}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>
                Check-out Time
              </label>

              <input
                type="time"
                name="checkOutTime"
                value={form.checkOutTime}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>
                Tax Percentage
              </label>

              <input
                type="number"
                name="taxPercentage"
                value={form.taxPercentage}
                onChange={handleChange}
                min="0"
                max="100"
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              Cancellation Policy
            </label>

            <textarea
              name="cancellationPolicy"
              value={
                form.cancellationPolicy
              }
              onChange={handleChange}
              rows="4"
            />
          </div>
        </section>

        {/* Payment Settings */}

        <section className="settings-section">
          <h2>Payment Settings</h2>

          <label className="setting-toggle">
            <input
              type="checkbox"
              name="enableOnlinePayment"
              checked={
                form.enableOnlinePayment
              }
              onChange={handleChange}
            />

            <span>
              Enable Online Payment
            </span>
          </label>
        </section>

        {/* Notification Settings */}

        <section className="settings-section">
          <h2>
            Notification Settings
          </h2>

          <label className="setting-toggle">
            <input
              type="checkbox"
              name="enableEmailNotifications"
              checked={
                form.enableEmailNotifications
              }
              onChange={handleChange}
            />

            <span>
              Enable Email Notifications
            </span>
          </label>

          <label className="setting-toggle">
            <input
              type="checkbox"
              name="enableBookingNotifications"
              checked={
                form.enableBookingNotifications
              }
              onChange={handleChange}
            />

            <span>
              Enable Booking Notifications
            </span>
          </label>

          <label className="setting-toggle">
            <input
              type="checkbox"
              name="enablePaymentNotifications"
              checked={
                form.enablePaymentNotifications
              }
              onChange={handleChange}
            />

            <span>
              Enable Payment Notifications
            </span>
          </label>
        </section>

        {/* Save */}

        <div className="settings-actions">
          <button
            type="submit"
            className="book-btn"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Settings;