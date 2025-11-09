function isMobile()
{
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
		|| (navigator.userAgent.includes("Mac") && "ontouchend" in document)
	) 
	{
		return true;
	}
	else
	{
		return false;
	}	
}