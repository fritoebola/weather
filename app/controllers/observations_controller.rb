class ObservationsController < ApplicationController
  respond_to :json

  def index
    respond_with Observation.on_date(date)
  end

  private

  def date
    Date.parse(params[:date])
  end
end
