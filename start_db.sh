#!/usr/bin/env bash

#see: http://exponential.io/blog/2015/02/21/install-postgresql-on-mac-os-x-via-brew/
#Sometimes needed for troubleshooting: http://stackoverflow.com/questions/27700596/homebrew-postgres-broken
postgres -D /usr/local/var/postgres

#in psql
#create database hackathonsapp;
#\connect DBNAME

#raw postgres
#clear all values in db
#TRUNCATE TABLE hackathons CASCADE;

#Wat ik op mijn oude mac most doen:
#initdb /usr/local/var/melvin
#postgres -D /usr/local/var/melvin
#createdb melvin
#psql

#Wat ook kan:
#rm -r /var/local/usr/postgres; initdb /usr/local/var/postgres
#postgres -D /usr/local/var/postgres
#createdb postgres
#createdb melvin
#psql melvin