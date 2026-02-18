use chrono::{Datelike, NaiveDateTime, Timelike};
use serde::{Deserialize, Serialize};

use crate::components::player::PlayerSrc;

impl From<&String> for Recording {
    fn from(file_name: &String) -> Self {
        let datetime =
            NaiveDateTime::parse_from_str(file_name, "%d-%m-%Y-%H-%M.mp3").expect(file_name);
        let date = datetime.date();
        let public_url = std::env::var("PUBLIC_URL").unwrap_or("http://localhost:8080".to_string());
        Recording {
            day: date.day(),
            month: date.month(),
            year: date.year(),
            weekday: date.weekday().number_from_monday(),
            hour: datetime.time().hour(),
            src: format!("{}/uzg_data/{}", public_url, file_name),
            key: datetime.and_utc().timestamp(),
        }
    }
}

impl From<Recording> for PlayerSrc {
    fn from(value: Recording) -> Self {
        value.src.into()
    }
}

impl From<&Recording> for PlayerSrc {
    fn from(value: &Recording) -> Self {
        value.src.clone().into()
    }
}

#[derive(PartialEq, Serialize, Deserialize, Clone, Debug)]
pub struct Recording {
    pub day: u32,
    pub month: u32,
    pub year: i32,
    pub weekday: u32,
    pub hour: u32,
    pub src: String,
    pub key: i64,
}
impl Recording {
    pub fn label(&self) -> String {
        format!("{}:00", self.hour)
    }
    pub fn title(&self) -> String {
        format!(
            "Uitzending Dinxper FM van {} {} {} {} om {} uur",
            self.weekday_long_c().to_lowercase(),
            self.day,
            self.month_long_c().to_lowercase(),
            self.year,
            self.hour
        )
    }
    fn weekday_long_c(&self) -> String {
        match self.weekday {
            1 => "Maandag",
            2 => "Dinsdag",
            3 => "Woensdag",
            4 => "Donderdag",
            5 => "Vrijdag",
            6 => "Zaterdag",
            7 => "Zondag",
            _ => "",
        }
        .to_string()
    }
    pub fn month_long_c(&self) -> String {
        match self.month {
            1 => "Januari",
            2 => "Februari",
            3 => "Maart",
            4 => "April",
            5 => "Mei",
            6 => "Juni",
            7 => "Juli",
            8 => "Augustus",
            9 => "September",
            10 => "Oktober",
            11 => "November",
            12 => "December",
            _ => "",
        }
        .to_string()
    }
    pub fn listing_title(&self) -> String {
        format!(
            "{} {} {}",
            self.weekday_long_c(),
            self.day,
            self.month_long_c().to_lowercase()
        )
    }
}
